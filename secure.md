# Security Baseline

This document describes the minimum security practices for running and extending the Stripo Framework. It is foundational guidance, not a certification or a guarantee that every control is already implemented.

## Protect credentials

- Keep `STRIPO_SECRET_KEY` private.
- Store production secrets in a secret manager or protected environment variables.
- Never place secrets in browser JavaScript, HTML, screenshots, issue reports, or source control.
- Never commit `.env`.
- Commit `.env.example` with placeholder values only.
- Rotate the Stripo credentials immediately if they are exposed.
- Use separate credentials for development, testing, and production when Stripo supports it.

## Authenticate users

Every production API route should verify the identity of the caller before performing work.

- Protect `/api/stripo/token` with application authentication.
- Protect `/api/projects` with authentication and authorization.
- Give users only the permissions they need.
- Do not use the hardcoded demo identity in a multi-user production system.
- Do not trust user IDs, roles, or project ownership values supplied by the browser.
- Enforce authorization on the server for every protected operation.

## Use secure transport

- Serve production traffic over HTTPS only.
- Redirect HTTP requests to HTTPS at the reverse proxy.
- Use secure, HttpOnly, SameSite cookies when sessions are added.
- Do not send tokens in URLs.
- Set `Cache-Control: no-store` on responses that contain authentication tokens.

## Validate input

Treat all browser input as untrusted.

- Validate request bodies against an explicit schema.
- Keep project names limited to the allowed character set and length.
- Reject unexpected fields where practical.
- Enforce request size limits.
- Sanitize or safely encode user-controlled content before displaying it.
- Do not build shell commands, file paths, SQL queries, or HTML from raw user input.
- Keep generated project paths inside the approved storage directory.

## Protect endpoints

- Add rate limiting to authentication and project-creation routes.
- Add request timeouts when calling external services such as Stripo.
- Return generic error messages to clients.
- Log useful diagnostic details on the server without logging secrets or tokens.
- Use CORS restrictions if the API is called from a separate frontend origin.
- Add CSRF protection when cookie-based authentication is used.

## Set browser security headers

Configure these at the reverse proxy or application layer as appropriate:

- `Content-Security-Policy`
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `frame-ancestors` through the Content Security Policy

Review the Content Security Policy carefully because the editor loads resources from Stripo domains and may require approved external connections.

## Handle files safely

- Do not expose `.env`, secret files, logs, or private project storage through static file serving.
- Store generated projects outside the public web root when possible.
- Restrict file permissions on the project directory.
- Allow only expected file types and sizes for uploads.
- Scan uploaded files when the deployment environment supports malware scanning.
- Avoid extracting untrusted archives without path traversal protection.

## Keep dependencies maintained

- Run `npm audit` regularly and review the results.
- Keep Node.js and dependencies on supported versions.
- Review dependency changes before installing them.
- Commit `package-lock.json` so installs are reproducible.
- Remove packages that are no longer required.
- Use automated dependency and secret scanning in the GitHub repository.

## Log and monitor safely

Monitor:

- Authentication failures
- Authorization failures
- Rate-limit events
- Project creation failures
- External Stripo API failures
- Unexpected server errors

Do not log:

- Stripo Secret Keys
- Access tokens
- Session cookies
- Full request bodies containing private content

Set up alerting for repeated authentication failures, unusual project creation volume, and persistent external API errors.

## Production deployment checklist

Before making the application public:

- [ ] Production credentials are stored outside source control.
- [ ] `.env` is ignored and has never been committed.
- [ ] HTTPS is enabled.
- [ ] API authentication and authorization are enabled.
- [ ] Rate limiting is enabled.
- [ ] Request size limits and timeouts are configured.
- [ ] Security headers are configured.
- [ ] Public static file access has been reviewed.
- [ ] Project storage is protected and backed up as required.
- [ ] Dependencies have been audited.
- [ ] Logs do not contain secrets.
- [ ] Error monitoring and health checks are active.
- [ ] A credential rotation and incident-response procedure exists.

## If a secret is exposed

1. Revoke or rotate the exposed credential immediately.
2. Check repository history, build logs, screenshots, and deployment logs.
3. Review access logs for suspicious activity.
4. Remove the secret from tracked files and history where appropriate.
5. Issue a new credential through the approved secret-management process.
6. Document what happened and what was changed.

Security is an ongoing operating practice. Revisit this document whenever the application gains authentication, file uploads, external integrations, or public deployment.
