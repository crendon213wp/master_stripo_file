import "dotenv/config";
import { execFile } from "node:child_process";
import { mkdir, copyFile } from "node:fs/promises";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT || 3000);
const filename = fileURLToPath(import.meta.url);
const directory = path.dirname(filename);
const frameworkDirectory = path.dirname(directory);
const projectsDirectory = frameworkDirectory;

if (!process.env.STRIPO_PLUGIN_ID || !process.env.STRIPO_SECRET_KEY) {
    throw new Error(
        "Missing STRIPO_PLUGIN_ID or STRIPO_SECRET_KEY in the .env file.",
    );
}

app.use(express.static(directory));
app.use(express.json());

app.post("/api/projects", async (request, response) => {
    const requestedName = request.body?.name;
    const projectName = requestedName || createDefaultProjectName();

    if (!/^[a-zA-Z0-9_-]+$/.test(projectName)) {
        return response.status(400).json({
            error: "Project name may contain only letters, numbers, hyphens, and underscores.",
        });
    }

    const projectDirectory = path.join(projectsDirectory, projectName);

    try {
        await mkdir(projectsDirectory, { recursive: true });
        await mkdir(projectDirectory, { recursive: false });

        for (const file of [
            "index.html",
            "server.js",
            "package.json",
            "package-lock.json",
            ".env.example",
            ".gitignore",
        ]) {
            await copyFile(path.join(directory, file), path.join(projectDirectory, file));
        }

        response.status(201).json({
            projectName,
            projectPath: projectDirectory,
        });
    } catch (error) {
        if (error.code === "EEXIST") {
            return response.status(409).json({
                error: `A project named ${projectName} already exists.`,
            });
        }

        console.error("Project creation failed:", error);
        response.status(500).json({ error: "Project creation failed." });
    }
});

app.get("/api/stripo/token", async (request, response) => {
    try {
        const stripoResponse = await fetch(
            "https://plugins.stripo.email/api/v1/auth",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    pluginId: process.env.STRIPO_PLUGIN_ID,
                    secretKey: process.env.STRIPO_SECRET_KEY,
                    userId: "1",
                    role: "user",
                }),
            },
        );
        const data = await stripoResponse.json();

        if (!stripoResponse.ok || !data.token) {
            console.error("Stripo authentication failed:", data);
            return response
                .status(502)
                .json({ error: "Stripo authentication failed" });
        }

        response.json({ token: data.token });
    } catch (error) {
        console.error("Stripo token request failed:", error);
        response.status(500).json({ error: "Token request failed" });
    }
});

function openBrowser(url) {
    const command =
        process.platform === "win32"
            ? "cmd"
            : process.platform === "darwin"
              ? "open"
              : "xdg-open";
    const argumentsList =
        process.platform === "win32" ? ["/c", "start", "", url] : [url];

    execFile(command, argumentsList, (error) => {
        if (error) {
            console.warn(`Could not open the browser automatically: ${error.message}`);
        }
    });
}

function createDefaultProjectName() {
    const timestamp = new Date()
        .toISOString()
        .replace(/[-:TZ.]/g, "")
        .slice(0, 14);
    return `stripo-project-${timestamp}`;
}

app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`Stripo app running at ${url}`);
    openBrowser(url);
});
