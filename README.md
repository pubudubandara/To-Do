# Full-Stack To‑Do App (MySQL + Express + React + Node, TypeScript)

A simple, modern To‑Do application with a glass UI, built with:

- Frontend: React (Vite, TypeScript) + Tailwind CSS v4 (@theme)
- Backend: Express 5 (TypeScript) + mysql2/promise
- Database: MySQL (schema auto‑created on server startup)

## Features

- Create, edit, and complete tasks (title + optional description).
- Shows the most recent incomplete tasks (fast, minimal list).
- Polished glassmorphism UI with responsive layout.
- Loading skeletons, error banner, and toast feedback (react-hot-toast).
- Robust API error handling (404 + global error middleware).
- Frontend proxy to backend for clean /api calls in dev.
- Note: The previous client‑side “30‑day auto archive/delete” has been removed.

## Prerequisites

- Node.js 18+ and npm
- A running MySQL instance you can connect to

Optional:
- Docker (if you want to spin up MySQL easily) and the provided `db/init.sql` to seed data

## Getting Started (Windows PowerShell)

Open two terminals, one for the backend and one for the frontend.

Backend (TypeScript with live reload):

```powershell
Set-Location -Path "c:\Personal\MY WORKS\ToDo\backend"
npm install
copy .env.example .env
# Edit .env if needed: PORT, CORS_ORIGIN, MYSQL_* values
npm run dev    # starts ts-node-dev on port 5000 by default
```

Frontend (Vite dev server with proxy):

```powershell
Set-Location -Path "c:\Personal\MY WORKS\ToDo\frontend"
npm install
npm run dev    # opens http://localhost:3000
```

Notes:
- The frontend proxies `/api` to `http://localhost:5000` by default. If you run the backend under a Docker network hostname, set `USE_DOCKER=true` before starting the frontend.
- If you want to use production mode:
   - Backend: `npm run build` then `npm start` (requires compiled `dist`).
   - Frontend: `npm run build` then `npm run preview`.

## API Endpoints

- GET `/api/health` → Simple health check
- GET `/api/tasks` → List recent incomplete tasks
- POST `/api/tasks` → Create task (body: `{ title, description? }`)
- PUT `/api/tasks/:id` → Update title/description for an incomplete task
- PUT `/api/tasks/:id/complete` → Mark task as completed

## Configuration

Backend `.env` (see `backend/.env.example`):

```
PORT=5000
CORS_ORIGIN=http://localhost:3000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=task_db
```

On backend startup, the server ensures the database and the `task` table exist (creates them if missing).

Frontend Tailwind CSS v4:

- Custom colors are defined using `@theme` variables in `frontend/src/index.css`.
- Some IDEs may flag `@theme` as unknown; the build works correctly with Tailwind v4.

## Project Structure (key files)

```
.
├── README.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts             # Express app, routes, error handlers, ensureSchema()
│       ├── db.ts                # MySQL pool + schema bootstrap
│       ├── task.model.ts        # Task interface
│       ├── task.controller.ts   # get/add/update/complete handlers
│       └── task.routes.ts       # /api/tasks routes
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css            # Tailwind v4 + @theme colors
│       ├── types.ts             # shared Task type
│       └── components/
│           ├── Navbar.tsx
│           ├── ErrorBanner.tsx
│           └── TaskList.tsx
└── db/
      └── init.sql                 # optional SQL to init DB + sample seed
```

## Troubleshooting

- Frontend cannot reach backend (ENOTFOUND or 404):
   - Ensure backend is running on the expected host/port.
   - Frontend proxies to `http://localhost:5000` by default; set `USE_DOCKER=true` if your backend host is `backend` in Docker.
- Backend `npm start` fails: build first with `npm run build`, or use `npm run dev` for TypeScript live reload.
- Tailwind `@theme` warning in IDE: safe to ignore; build succeeds with Tailwind v4.

## License

MIT