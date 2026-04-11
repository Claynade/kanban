# Kanban

A simple full-stack Kanban app for managing projects and tasks.

## Stack

- Backend: Express, MongoDB, Mongoose, JWT
- Frontend: React, Vite, React Router, Axios, Tailwind CSS

## Setup

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=kanban
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

## Run

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## License

ISC
