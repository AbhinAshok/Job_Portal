# HireFlow React Frontend

A complete React 19 + Vite frontend for the HireFlow Django 5.2 + DRF + SimpleJWT API.

## Stack

- React 19
- Vite
- React Router v7
- Axios
- Framer Motion
- Lucide React
- Responsive custom CSS

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows, create `.env` manually with:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## Backend contract implemented

The UI integrates the 52-endpoint API reference across:

- Authentication / profiles
- Companies
- Jobs
- Applications
- Resumes
- Interviews
- Notifications
- Messaging

Pagination (`count`, `next`, `previous`, `results`), JWT refresh rotation, role-based routing, validation errors, and multipart uploads are handled.

## Important API behavior

The frontend never manually sets `Content-Type` for multipart requests. Axios/browser generates the multipart boundary.

JWT:
- access token: localStorage
- refresh token: localStorage
- access attached as Bearer token
- 401 -> refresh -> replace both tokens -> retry
- refresh failure -> logout

For production, move token handling to secure httpOnly cookies when the backend is configured for it.
