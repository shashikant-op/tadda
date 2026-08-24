# TutorialsAdda

TutorialsAdda is a full-stack engineering tutorial platform with a Next.js frontend, an Express/MongoDB API, and an isolated AI course-generation pipeline.

## Applications

- `thubnew/` — Next.js frontend and admin interface.
- `backend/` — Express REST API, MongoDB models, JWT authentication, uploads, quizzes, bookmarks, and progress.
- `aipipeline/` — TypeScript research, curriculum, content, validation, and persistence pipeline.

## Local setup

Install dependencies separately in each application:

```bash
cd backend && npm install
cd ../aipipeline && npm install
cd ../thubnew && npm install
```

Copy each `.env.example` to the corresponding local environment file and provide development credentials. Never commit real secrets.

Run the backend and frontend in separate terminals:

```bash
cd backend && npm run dev
cd thubnew && npm run dev
```

## Verification

```bash
cd backend && npm run test:unit
cd aipipeline && npm test && npm run build
cd thubnew && npm run lint && npx tsc --noEmit && npm run build
```

The legacy backend integration tests require a reachable MongoDB test environment. Production audit status and remaining risks are tracked in `PRODUCTION_AUDIT.md`.
