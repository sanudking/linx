# Lincxx — Real-time Academic Collaboration Platform

> Where academic minds connect.

Lincxx bridges students, professors, and alumni through real-time collaboration, GitHub-powered skill matching, and exclusive academic opportunities.

## ✨ Features

- **🔴 Real-time Pulse** — Live activity feed powered by Socket.io
- **🐙 GitHub Skills** — Auto-extract skills from your GitHub repositories  
- **🗂 Project Hub** — Discover & join research projects matched to your skills
- **💼 Job Board** — Internships, research positions, and jobs posted by alumni
- **🎓 Alumni Network** — Connect with graduates for mentorship
- **✅ Edu Verified** — Academic email verification (.edu, .ac.uk, .edu.in, etc.)
- **🔐 JWT Auth** — Secure access & refresh token authentication

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 4 |
| Database | MongoDB + Mongoose |
| Real-time | Socket.io |
| Auth | JWT (access + refresh tokens) |
| State | Zustand |
| HTTP Client | Axios |

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for full setup instructions.

```bash
# Clone & setup environment
cp server/.env.example server/.env
cp client/.env.example client/.env

# Install dependencies
cd server && npm install
cd ../client && npm install

# Run in development
# Terminal 1: server
cd server && npm run dev
# Terminal 2: client
cd client && npm run dev
```

Open http://localhost:5173

## 📁 Project Structure

```
linx/
├── server/          # Express API + Socket.io
│   ├── controllers/ # Request handlers
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth, error handling
│   ├── sockets/     # Real-time event handlers
│   └── utils/       # Email, GitHub, validators
└── client/          # React + Vite SPA
    └── src/
        ├── components/  # Reusable UI components
        ├── pages/       # Route pages
        ├── hooks/       # Custom React hooks
        ├── services/    # API + Socket clients
        ├── store/       # Zustand state
        └── utils/       # Helpers & constants
```

## 📡 API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/register | Register with edu email |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/projects | List projects |
| POST | /api/projects | Create project |
| GET | /api/jobs | List jobs |
| POST | /api/jobs/:id/apply | Apply to job |
| GET | /api/activities/feed | Live activity feed |
| GET | /api/users/search | Search users |

## 📄 License

MIT
