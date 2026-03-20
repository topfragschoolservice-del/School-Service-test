# School-Service-test

Smart School Transport Management System.

## Quick Start (Full Web App)

Run these from the project root:

```bash
npm install
npm run backend:install
cp backend/.env.example backend/.env
```

Create a root `.env` file with:

```bash
REACT_APP_API_URL=http://localhost:5001/api
```

Then run in two terminals:

```bash
npm run backend:start
npm start
```

App URLs:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:5001/api/health`

## Frontend

Run the React app:

```bash
npm install
npm start
```

Frontend URL:

```bash
http://localhost:3000
```

## Backend

The backend lives in `backend/` and uses Express, MongoDB, and JWT auth.

Install backend dependencies:

```bash
npm run backend:install
```

Create the backend environment file:

```bash
cp backend/.env.example backend/.env
```

Then set these values in `backend/.env`:

- `PORT=5001`
- `MONGODB_URI=your_mongodb_connection_string`
- `JWT_SECRET=your_secure_secret`
- `ADMIN_ACCESS_CODE=ADMIN2026`
- `CLIENT_URL=http://localhost:3000`

Run the backend in development mode:

```bash
npm run backend:start
```

Backend health check:

```bash
http://localhost:5001/api/health
```

## Main Backend APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/students`
- `POST /api/attendance/parent-mark`
- `PATCH /api/attendance/:id/driver-status`
- `GET /api/payments`
- `GET /api/notifications/me`
- `POST /api/tracking/location`
- `GET /api/reports/parent/monthly/:studentId`
- `GET /api/reports/admin/monthly`

## Notes

- The frontend currently stores session data in localStorage and calls backend APIs through `src/api.js`.
- For demo compatibility, login supports either password-based auth or the current ID + phone flow.

## Troubleshooting

- If you get `EADDRINUSE` on backend start, another process is already using your port. Change `PORT` in `backend/.env` and update `REACT_APP_API_URL` in root `.env` to match.

## Hosting (Production)

This project is ready to deploy as a single web service (frontend + backend) using Render.

### Option A: Blueprint deploy (recommended)

1. Push this project to GitHub.
2. In Render, choose **New +** -> **Blueprint**.
3. Connect your repo and deploy. Render reads `render.yaml`.
4. Set these environment variables in Render:
	 - `JWT_SECRET` (required)
	 - `MONGODB_URI` (required, use MongoDB Atlas URI)
	 - `CLIENT_URL` (set to your final Render app URL)

### Option B: Manual web service

- Build command: `npm run deploy:build`
- Start command: `npm run deploy:start`
- Environment:
	- `NODE_ENV=production`
	- `PORT=5001`
	- `JWT_SECRET=...`
	- `ADMIN_ACCESS_CODE=ADMIN2026`
	- `MONGODB_URI=...`
	- `CLIENT_URL=https://your-app.onrender.com`

After deployment, open:

- `https://your-app.onrender.com`
- `https://your-app.onrender.com/api/health`
