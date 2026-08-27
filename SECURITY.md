# Security Policy

## Overview

ALTA is a prototype learning application that handles user accounts, learning data, generated content and requests to external AI services.

The repository includes application-level controls intended to reduce common risks such as credential exposure, weak password storage, token tampering, NoSQL operator injection, excessive requests and unsafe filenames.

This document describes the controls currently implemented in the repository. It does not claim that the prototype is a security-certified or production-hardened system.

## Authentication

ALTA implements server-side authentication using signed Bearer tokens.

- Registration and login are provided through `/api/auth/register` and `/api/auth/login`.
- Protected routes use `requireAuth`.
- Tokens contain a user ID, role, email/name information and an expiration timestamp.
- Tokens expire after seven days.
- The server requires `JWT_SECRET` to be configured and rejects startup when the secret is missing or shorter than the configured minimum.
- Token signatures use HMAC-SHA256.
- Token signatures are compared using `crypto.timingSafeEqual`.

## Password Security

User passwords are not stored as plaintext.

The authentication utility uses Node.js `crypto.scryptSync()` with a cryptographically random 16-byte salt and a 64-byte derived key.

Stored password values use the form:

```text
scrypt$<salt_hex>$<derived_key_hex>
```

Password verification uses a timing-safe comparison.

## Authorization

Routes that modify or access protected user-specific resources use the authenticated user identity supplied by the verified token.

Examples include protected user and note operations.

The server also contains checks intended to prevent users from operating on resources belonging to another user.

## Request and Database Input Protection

The server applies recursive sanitization to request bodies, query parameters and route parameters.

Keys beginning with `$` or containing `.` are removed to reduce MongoDB operator/path injection risks.

User input used for MongoDB regular-expression searches is escaped through `escapeRegex()`.

These controls are application-level protections and should not be treated as a substitute for a complete production security review.

## Rate Limiting

The application implements an in-memory sliding-window rate limiter.

It is applied to:
- authentication endpoints
- write/sensitive operations
- AI and translation endpoints

AI/translation endpoints have a limit of 60 requests per minute in the current server configuration.

Because the limiter is in-memory, it is process-local and is not a distributed rate-limiting solution for horizontally scaled production deployments.

## Security Headers

The server applies response headers including:

- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- removal of the `X-Powered-By` header

## File Upload Handling

The application supports learning-document and media uploads.

Filename sanitization:
- removes path components
- removes null bytes
- replaces unsupported characters
- limits filename length

The media workflows also restrict accepted extensions/types at the client interface.

The repository does **not** claim antivirus scanning or malware analysis.

## Media and AI Processing

For uploaded audio/video transcription, the browser extracts audio data before sending the media payload to the backend transcription endpoints.

The backend sends the supplied media to Gemini for transcription.

The transcription prompt explicitly instructs the model not to fabricate spoken content and returns an error when no usable speech is detected.

Generated-content persistence is designed around data minimization for the relevant paths: the application stores generated output and metadata rather than intentionally storing the original raw source media/text in those generated-content records.

External AI provider processing is subject to the applicable provider's own policies and terms.

## Secrets Management

Sensitive configuration is provided through environment variables.

The repository provides `.env.example` with empty/placeholder values.

Never commit:
- Gemini API keys
- OpenRouter API keys
- MongoDB credentials
- JWT secrets
- passwords
- access tokens

The `.gitignore` excludes `.env*` while allowing `.env.example`.

If a secret is ever committed, revoke/rotate it immediately and remove it from repository history as appropriate.

## Known Security Limitations

This is a hackathon prototype, not a security-certified production system.

Known limitations include:
- rate limiting is process-local
- browser/client-side authentication state uses session storage for the active token
- external AI services introduce third-party data-processing considerations
- the application has not undergone an independent penetration test
- production deployment should add infrastructure-level controls such as HTTPS, secure deployment secrets, monitoring and centralized rate limiting

## Reporting a Vulnerability

Please report security issues privately to the project maintainers rather than publicly posting credentials or exploitable details.

For the hackathon repository, open a GitHub security/private contact mechanism if available, or contact the repository maintainers directly.

When reporting an issue, include:
- affected component/file
- steps to reproduce
- security impact
- suggested remediation, if known

Do not include real API keys, passwords or personal data in a report.
