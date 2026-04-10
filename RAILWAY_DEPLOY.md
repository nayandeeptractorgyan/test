# 🚂 Railway Deployment Guide — ParkTicket

## Architecture on Railway

```
Railway Service (1 service — free tier friendly)
    └── Node.js server
         ├── Serves /api/* → Express backend
         └── Serves /* → React frontend (built static files)

MongoDB Atlas (free 512MB cluster — external)
```

---

## STEP 1 — Set Up MongoDB Atlas (Free Database)

Railway's built-in MongoDB is paid. Use Atlas free tier instead.

1. Go to **https://www.mongodb.com/atlas** → Sign up free
2. Click **"Build a Database"** → Choose **Free (M0 Sandbox)**
3. Select a region closest to you → Click **"Create"**
4. **Create a database user:**
   - Username: `parkticket`
   - Password: generate a strong password — **SAVE IT**
   - Click "Create User"
5. **Set Network Access:**
   - Click "Add IP Address"
   - Click **"Allow access from anywhere"** (`0.0.0.0/0`)
   - This is required for Railway to connect
   - Click "Confirm"
6. **Get your connection string:**
   - Go to "Database" → Click **"Connect"**
   - Choose **"Connect your application"**
   - Driver: Node.js, Version: 5.5 or later
   - Copy the URI — it looks like:
     ```
     mongodb+srv://parkticket:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add your database name before `?`:
     ```
     mongodb+srv://parkticket:YOURPASSWORD@cluster0.xxxxx.mongodb.net/parking_system?retryWrites=true&w=majority
     ```
   - **Save this URI — you'll need it in Step 3**

---

## STEP 2 — Push Code to GitHub

Railway deploys from GitHub. You need your code in a repo.

```bash
# In the parking-system folder:
git init
git add .
git commit -m "Initial commit — ParkTicket"

# Create a new repo on github.com (don't add README/gitignore)
# Then:
git remote add origin https://github.com/YOUR_USERNAME/parkticket.git
git branch -M main
git push -u origin main
```

---

## STEP 3 — Deploy on Railway

### A) Create Railway account
1. Go to **https://railway.app**
2. Sign up with your GitHub account (important — lets Railway access your repos)

### B) Create a new project
1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select your `parkticket` repository
4. Railway auto-detects it and starts building

### C) Set environment variables
1. Click on your service (it'll be building)
2. Go to **"Variables"** tab
3. Click **"RAW Editor"** and paste ALL of these:

```
MONGODB_URI=mongodb+srv://parkticket:YOURPASSWORD@cluster0.xxxxx.mongodb.net/parking_system?retryWrites=true&w=majority
JWT_SECRET=generate_a_long_random_string_here_at_least_32_characters
NODE_ENV=production
PORT=8080
JWT_EXPIRES_IN=24h
```

> 🔐 **Generate JWT_SECRET:** Go to https://randomkeygen.com and copy a "256-bit WEP Key"

4. Click **"Update Variables"** — Railway will redeploy automatically

### D) Wait for build
- Build takes **3-5 minutes** (installs npm, builds React, starts server)
- Watch logs in the **"Deployments"** tab
- When you see `🚀 Server running on port 8080` — it's live!

### E) Get your URL
1. Go to **"Settings"** tab of your service
2. Under **"Networking"** → Click **"Generate Domain"**
3. You'll get a URL like: `https://parkticket-production.up.railway.app`
4. Open it — your app is live! 🎉

---

## STEP 4 — Seed Initial Data

After first deploy, run the seed script to create admin + ticket classes:

### Option A: Railway CLI (easiest)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run seed
railway run cd backend && node config/seed.js
```

### Option B: One-time seed endpoint
Add this temporarily to `backend/routes/auth.js` ONLY for first deploy,
then remove it:
```js
// TEMPORARY — remove after seeding!
router.post('/seed', async (req, res) => {
  require('../config/seed');
  res.json({ ok: true });
});
```
Then hit: `POST https://your-app.railway.app/api/auth/seed`

### Option C: Use MongoDB Atlas UI
1. Go to Atlas → Browse Collections
2. Manually insert your first superadmin user document

**After seeding, your login credentials are:**
```
Superadmin: superadmin / admin123
Operator 1: operator1 / op123
Operator 2: operator2 / op123
```

---

## STEP 5 — Verify Everything Works

Open your Railway URL and test:

- [ ] `https://your-app.railway.app` → Shows login page
- [ ] Login as `superadmin / admin123` → Goes to admin dashboard
- [ ] Login as `operator1 / op123` → Goes to operator panel
- [ ] Issue a ticket → Check print slip works
- [ ] Reports page loads with data
- [ ] `https://your-app.railway.app/api/health` → Returns `{"status":"OK"}`

---

## 🐳 DOCKER DEPLOYMENT (Alternative)

If you prefer Docker over Nixpacks, Railway supports it automatically.
The `Dockerfile` in the project root will be detected and used.

### Local Docker test (before deploying):
```bash
# Build image
docker build -t parkticket .

# Run with env vars
docker run -p 8080:8080 \
  -e MONGODB_URI="your_atlas_uri" \
  -e JWT_SECRET="your_secret" \
  -e NODE_ENV=production \
  parkticket

# Open http://localhost:8080
```

### Force Railway to use Dockerfile:
In Railway settings → "Build" → Change builder to **"Dockerfile"**

---

## 🔧 Environment Variables Reference

| Variable       | Required | Example Value                              |
|----------------|----------|--------------------------------------------|
| `MONGODB_URI`  | ✅ Yes   | `mongodb+srv://user:pass@cluster.../db`    |
| `JWT_SECRET`   | ✅ Yes   | `a_very_long_random_string_32plus_chars`   |
| `NODE_ENV`     | ✅ Yes   | `production`                               |
| `PORT`         | ✅ Yes   | `8080`                                     |
| `JWT_EXPIRES_IN` | No     | `24h`                                      |
| `FRONTEND_URL` | No       | Not needed (monorepo, same server)         |

---

## 🔄 Updating Your App

Every `git push` to `main` auto-redeploys on Railway:

```bash
# Make changes, then:
git add .
git commit -m "Update: added feature X"
git push origin main
# Railway auto-detects push → rebuilds → redeploys (zero downtime)
```

---

## 💰 Railway Pricing

| Plan    | Price       | What you get                             |
|---------|-------------|------------------------------------------|
| Hobby   | $5/month    | 512MB RAM, 1GB disk, custom domains      |
| Trial   | Free        | $5 credit, no credit card required       |

> **Tip:** The free trial is enough to test. For production use, Hobby plan ($5/mo) is recommended.

---

## 🚨 Troubleshooting

**Build fails with npm error:**
```bash
# In Railway Variables, add:
NODE_OPTIONS=--max-old-space-size=512
```

**MongoDB connection refused:**
- Check Atlas → Network Access → must have `0.0.0.0/0`
- Double-check MONGODB_URI has correct password
- Ensure database name is in the URI before `?`

**App loads but API returns 404:**
- Verify `NODE_ENV=production` is set
- Check deploy logs for startup errors

**"Cannot find module" error:**
- Railway may have cached old build → go to Deployments → "Redeploy"

---

## 📁 Files Added for Railway

```
parking-system/
├── Dockerfile          ← Multi-stage Docker build
├── .dockerignore       ← Files to exclude from Docker
├── railway.json        ← Railway build/deploy config
├── nixpacks.toml       ← Nixpacks build steps
├── .gitignore          ← Git ignore rules
├── .env.example        ← Environment variable template
└── RAILWAY_DEPLOY.md   ← This file
```
