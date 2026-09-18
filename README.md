# Stripo Framework

This is a small app for working with the Stripo email editor.

It does two useful things:

- Starts the Stripo editor in your browser.
- Creates a new project beside the `Master File` directory.

The app needs Node.js, Stripo credentials, and a reliable internet connection. The internet connection matters because the editor and authentication service are hosted by Stripo.

## Before you begin

Install these first:

- Node.js 18 or newer
- npm
- Git
- A Stripo Plugin ID
- A Stripo Secret Key

## 1. Download the project

Replace `<YOUR_GITHUB_REPOSITORY_URL>` with the HTTPS URL of your GitHub repository.

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <CLONED_REPOSITORY_DIRECTORY>
```

If the repository contains the parent folder structure, use this instead:

```bash
cd stripo_framework/Master\ File
```

On Windows PowerShell:

```powershell
git clone <YOUR_GITHUB_REPOSITORY_URL>
Set-Location "<CLONED_REPOSITORY_DIRECTORY>"
```

With the parent folder structure:

```powershell
Set-Location "stripo_framework\Master File"
```

## 2. Create your private settings file

The repository includes `.env.example`. It is a form. Your job is to make the real file.

From the `Master File` directory, copy it to `.env`.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### Windows Command Prompt

```cmd
copy .env.example .env
```

### macOS or Linux

```bash
cp .env.example .env
```

Open `.env`. Replace both placeholder values:

```env
STRIPO_PLUGIN_ID=your-real-stripo-plugin-id
STRIPO_SECRET_KEY=your-real-stripo-secret-key
```

Use the credentials supplied by Stripo. Then save the file.

Do not upload `.env` to GitHub. It contains private credentials. The `.gitignore` file is already set up to keep it out of Git. Commit `.env.example`, not `.env`.

## 3. Install the dependencies

Run this from the `Master File` directory:

```bash
npm install
```

This downloads the packages the app needs. One command. No ceremony.

## 4. Start the app

```bash
npm start
```

Open this address in your browser:

```text
http://localhost:3000
```

Leave the terminal running while you use the editor.

## 5. Check the connection

The browser asks your local server for a Stripo token:

```text
GET http://localhost:3000/api/stripo/token
```

Your local server then asks Stripo to create the token. Your Stripo Secret Key stays on the server. That is where it belongs.

The **New Project** button uses this endpoint:

```text
POST http://localhost:3000/api/projects
```

New projects are created here:

```text
stripo_framework\<project-name>
```

They are placed beside `Master File`, not inside it.

## Troubleshooting

### The server says credentials are missing

Check these four things:

1. The file is named `.env`.
2. The file is inside `Master File`.
3. `STRIPO_PLUGIN_ID` has a real Plugin ID.
4. `STRIPO_SECRET_KEY` has a real Secret Key.

Restart the server after changing `.env`.

### Port 3000 is already being used

Use another port in PowerShell:

```powershell
$env:PORT=3001
npm start
```

Then open:

```text
http://localhost:3001
```

### The New Project button reports an error

Make sure:

- The server is running from `Master File`.
- The parent `stripo_framework` folder is writable.
- You are not trying to create a project with a name that already exists.

## Keep the keys safe

- Never put the Secret Key in browser code.
- Never commit `.env`.
- Use HTTPS, authentication, and rate limiting before making the app public.
- This setup is designed for local development.
