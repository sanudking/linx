# Linx — Local Development Setup

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB (local or Atlas)
- Git

## 1. Clone & Navigate

```bash
git clone <repo-url>
cd linx
```

## 2. Server Setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and fill in:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (e.g. `mongodb://localhost:27017/linx`) |
| `JWT_SECRET` | Random 32+ character string for access tokens |
| `JWT_REFRESH_SECRET` | Different random 32+ character string for refresh tokens |
| `GITHUB_TOKEN` | Optional GitHub personal access token (increases API rate limit) |
| `EMAIL_USER` | Gmail address for sending verification emails |
| `EMAIL_PASS` | Gmail App Password (not your account password) |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:5173`) |

```bash
npm install
npm run dev
```

Server runs at **http://localhost:5000**

## 3. Client Setup

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:
- `VITE_API_URL` = `http://localhost:5000` (or your server URL)
- `VITE_SOCKET_URL` = `http://localhost:5000`

```bash
npm install
npm run dev
```

Client runs at **http://localhost:5173**

## 4. MongoDB

**Local:**
```bash
# Install MongoDB Community Edition
# macOS (Homebrew):
brew tap mongodb/brew && brew install mongodb-community
brew services start mongodb-community

# Set MONGODB_URI=mongodb://localhost:27017/linx
```

**MongoDB Atlas (Cloud):**
1. Create a free cluster at https://cloud.mongodb.com
2. Copy the connection string
3. Set `MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/linx`

## 5. Email Setup (Optional)

For verification emails with Gmail:
1. Enable 2-Step Verification on your Google account
2. Go to Google Account → Security → App Passwords
3. Generate an App Password
4. Set `EMAIL_USER=your@gmail.com` and `EMAIL_PASS=your-app-password`

## 6. GitHub Token (Optional)

For higher GitHub API rate limits:
1. Go to https://github.com/settings/tokens
2. Generate a new classic token (no scopes needed for public repos)
3. Set `GITHUB_TOKEN=your-token` in `server/.env` and `VITE_GITHUB_TOKEN=your-token` in `client/.env`

## Verifying Setup

```bash
# Health check
curl http://localhost:5000/api/health
# Expected: {"success":true,"message":"Linx API running",...}
```

## Deploying to Netlify

Netlify hosts the **frontend** (React/Vite). The backend must be deployed separately (e.g., [Railway](https://railway.app) or [Render](https://render.com)).

### Step 1 — Deploy the backend first

1. Create a free account at [Railway](https://railway.app) or [Render](https://render.com).
2. Connect your GitHub repo and select the `server` directory as the root.
3. Set all variables from `server/.env.example` in the platform's environment settings.
4. Deploy. Note the public URL (e.g., `https://linx-api.railway.app`).

### Step 2 — Deploy the frontend to Netlify

The repo already contains a `netlify.toml` that configures the build automatically.

**Option A — Netlify UI (recommended for beginners)**

1. Go to [app.netlify.com](https://app.netlify.com) and click **Add new site → Import an existing project**.
2. Connect your GitHub account and select the `sanudking/linx` repository.
3. Netlify will auto-detect the settings from `netlify.toml`:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Show advanced** → **New variable** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | Your backend URL (e.g., `https://linx-api.railway.app`) |
   | `VITE_SOCKET_URL` | Same backend URL |
   | `VITE_DEMO_MODE` | `false` (remove this to use real API; keep `true` for a static demo) |

5. Click **Deploy site**. Netlify will build and publish the site.

**Option B — Netlify CLI**

```bash
# Install the CLI
npm install -g netlify-cli

# Log in
netlify login

# From the repo root, initialize and deploy
netlify init         # follow prompts; base dir = client, publish = dist
netlify deploy --prod
```

### Step 3 — Point the backend to your Netlify URL

In your backend's environment variables, update:

```
CLIENT_URL=https://<your-site>.netlify.app
```

This fixes CORS so the browser can reach the API.

### Step 4 — Verify

Open your Netlify URL. You should see the Linx landing page. The Projects, Jobs, and Alumni pages will show live data from your backend.

> **Tip:** If you don't have a backend yet, leave `VITE_DEMO_MODE=true` (the default in `netlify.toml`). The site will display realistic sample data so you can explore all pages without a running server.



## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check `MONGODB_URI`, ensure MongoDB is running |
| JWT errors | Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set and 32+ chars |
| CORS errors | Ensure `CLIENT_URL` in server `.env` matches frontend URL |
| Socket.io not connecting | Ensure `VITE_SOCKET_URL` matches server URL |
| GitHub rate limit | Set `GITHUB_TOKEN` |
