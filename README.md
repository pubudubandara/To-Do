# Full‑Stack To‑Do App (MySQL + Express + React + TypeScript)

A modern To‑Do app with a glass UI, built with React (Vite, TS), Tailwind CSS v4, and an Express + MySQL backend.

## Features

- Add, edit, and delete tasks (title + optional description)
- Always shows the latest 5 tasks (sorted by created_at desc)
- Smooth UI animations (Framer Motion) for list and modal
- Toast feedback and error banner
- Robust API with health check

## Tech Stack

- Frontend: React + Vite + TypeScript, Tailwind CSS v4 (@theme), react-hot-toast, framer-motion
- Backend: Express 5 + TypeScript, mysql2/promise
- Database: MySQL (schema auto-created on backend startup; optional init SQL)
- Docker: Dockerfiles for frontend/backend + docker-compose

## Run locally (Windows PowerShell)

Backend

```
Set-Location -Path "c:\Personal\MY WORKS\ToDo\backend"
npm install
npm run dev   # http://localhost:5000
```

Frontend

```
Set-Location -Path "c:\Personal\MY WORKS\ToDo\frontend"
npm install
# Configure API base URL (optional; default example below)
Set-Content -Path .env -Value "VITE_API_BASE_URL=http://localhost:5000"
npm run dev   # http://localhost:3000
```

## Run with Docker

1) Set environment variables in the repo root `.env` (example):

```
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=task_db
MYSQL_USER=todo_user
MYSQL_PASSWORD=todopassword
BACKEND_PORT=5000
FRONTEND_PORT=3000
```

2) Start the stack:

```
docker compose up --build
```

Services
- MySQL: 3307->3306 (or 3306 depending on your compose mapping)
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

Notes
- Docker Desktop must be running (Linux engine). If you see “open //./pipe/dockerDesktopLinuxEngine”, start Docker Desktop and retry.
- Compose uses a user-defined network so the backend can resolve `mysql`.

## API

- GET `/api/health` → health check
- GET `/api/tasks` → last 5 tasks (created_at desc)
- POST `/api/tasks` → create task; body: `{ title: string, description?: string }`
- PUT `/api/tasks/:id` → update title/description
- DELETE `/api/tasks/:id` → delete task

## Configuration

- Root `.env` for docker-compose (see example above)
- Frontend `frontend/.env` with `VITE_API_BASE_URL=http://localhost:5000`
- Tailwind v4 custom colors defined via `@theme` in `frontend/src/index.css` (IDE may warn; build is correct)

## Project Structure (key files)

```
.
├── docker-compose.yml
├── .env              # compose variables
├── README.md
├── db-init/
│   └── init.sql      # optional DB bootstrap
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts
│       ├── db.ts
│       ├── task.model.ts
│       ├── task.controller.ts
│       └── task.routes.ts
└── frontend/
   ├── Dockerfile
   ├── index.html
   ├── package.json
   ├── vite.config.ts
   └── src/
      ├── App.tsx
      ├── index.css
      ├── main.tsx
      ├── types.ts
      └── components/
         ├── Navbar.tsx
         ├── ErrorBanner.tsx
         └── TaskList.tsx

