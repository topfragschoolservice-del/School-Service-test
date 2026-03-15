# School-Service-test

Smart School Transport Management System.

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

- `PORT=5000`
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
http://localhost:5000/api/health
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

- The current frontend is still using localStorage. The backend is now ready, but the frontend has not yet been refactored to call these APIs.
- For demo compatibility, login supports either password-based auth or the current ID + phone flow.
