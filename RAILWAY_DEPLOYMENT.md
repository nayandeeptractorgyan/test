# Railway Deployment Guide

## 📦 Complete Railway Deployment Steps

### Prerequisites
- [x] Railway account (https://railway.app)
- [x] MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- [x] Code pushed to GitHub repository

---

## Part 1: MongoDB Atlas Setup

### 1. Create MongoDB Atlas Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Build a Database"
3. Choose FREE tier (M0)
4. Select a region close to your Railway deployment
5. Create cluster

### 2. Configure Database Access

1. Go to "Database Access" in sidebar
2. Click "Add New Database User"
3. Create username and password (save these!)
4. Set privileges to "Read and write to any database"

### 3. Configure Network Access

1. Go to "Network Access" in sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### 4. Get Connection String

1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database password
5. Replace `<dbname>` with `premium-wood-brand`

Example:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/premium-wood-brand?retryWrites=true&w=majority
```

---

## Part 2: Backend Deployment to Railway

### 1. Create New Project

1. Go to https://railway.app
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Authorize Railway to access your GitHub
5. Select your repository

### 2. Configure Backend Service

1. After project creation, Railway will show your service
2. Click on the service
3. Go to "Settings" tab
4. Set **Root Directory**: `backend`
5. Set **Start Command**: `npm start`

### 3. Add Environment Variables

Click "Variables" tab and add:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/premium-wood-brand?retryWrites=true&w=majority
JWT_SECRET=super_secret_production_key_change_this_to_random_string_12345678
```

**Important**: Generate a strong JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Deploy

1. Railway will automatically deploy
2. Wait for build to complete (check "Deployments" tab)
3. Once deployed, click "Settings" → "Generate Domain"
4. Copy the domain (e.g., `https://premium-wood-backend.up.railway.app`)

### 5. Create First Admin User

```bash
curl -X POST https://premium-wood-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@premiumwood.com",
    "password": "YourSecurePassword123!",
    "name": "Admin User"
  }'
```

**⚠️ Important**: After creating admin, disable or protect the register endpoint!

---

## Part 3: Frontend Deployment to Railway

### 1. Update API URL in Frontend

In `frontend/src/services/api.js`, update:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://premium-wood-backend.up.railway.app/api';
```

Commit and push this change.

### 2. Create Frontend Service

1. In Railway project, click "New Service"
2. Choose "GitHub Repo"
3. Select same repository
4. Railway will create a new service

### 3. Configure Frontend Service

1. Click on the frontend service
2. Go to "Settings"
3. Set **Root Directory**: `frontend`
4. Set **Build Command**: `npm run build`
5. Set **Start Command**: `npx serve -s build -l $PORT`

### 4. Install serve package

Add to `frontend/package.json` dependencies:
```json
"dependencies": {
  ...existing dependencies...
  "serve": "^14.2.1"
}
```

### 5. Add Environment Variables

In frontend service, add:
```env
REACT_APP_API_URL=https://premium-wood-backend.up.railway.app/api
```

### 6. Generate Domain

1. Go to "Settings"
2. Click "Generate Domain"
3. Your site is now live!

---

## Part 4: Post-Deployment Configuration

### 1. Update CORS in Backend

Edit `backend/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.railway.app', 'https://yourproductiondomain.com'],
  credentials: true
}));
```

### 2. Test Your Deployment

Visit your frontend URL and verify:
- [x] Public website loads
- [x] Products page works
- [x] Admin login works
- [x] Can create products
- [x] Can submit orders
- [x] Images upload correctly

### 3. Configure Custom Domain (Optional)

**In Railway:**
1. Go to frontend service → Settings
2. Under "Domains", click "Custom Domain"
3. Add your domain (e.g., `premiumwood.com`)
4. Update DNS records as instructed by Railway

**DNS Configuration:**
Add CNAME record:
```
Type: CNAME
Name: @ (or www)
Value: your-app.railway.app
```

---

## Part 5: Security Hardening

### 1. Disable Register Endpoint

In `backend/routes/authRoutes.js`, comment out or protect:

```javascript
// router.post('/register', authController.registerAdmin);
// Or add authentication middleware
router.post('/register', auth, authController.registerAdmin);
```

### 2. Enable Rate Limiting

Install express-rate-limit:
```bash
cd backend
npm install express-rate-limit
```

Add to `backend/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Add Helmet for Security Headers

```bash
npm install helmet
```

In `backend/server.js`:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## Part 6: Monitoring & Maintenance

### 1. Monitor Railway Logs

- Click on service → "Deployments" → Select deployment → "View Logs"
- Set up alerts for errors

### 2. Monitor MongoDB Atlas

- Go to Atlas → Your Cluster → "Metrics"
- Check connection count, operations, disk usage

### 3. Regular Backups

Railway doesn't backup your database automatically:
- Set up MongoDB Atlas automated backups
- Go to Cluster → "Backup" tab
- Enable Cloud Backups (may require paid tier)

### 4. Update Dependencies Regularly

```bash
# Check for updates
npm outdated

# Update packages
npm update
```

---

## Troubleshooting

### Backend won't start
- Check Railway logs
- Verify MONGODB_URI is correct
- Ensure MongoDB Atlas allows Railway's IP (0.0.0.0/0)

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS configuration in backend
- Ensure backend is running

### Images not uploading
- Railway has ephemeral filesystem
- Consider using Cloudinary, AWS S3, or similar for production
- Alternative: Store images as base64 in MongoDB (not recommended for many images)

### Database connection fails
- Check MongoDB Atlas network access
- Verify connection string format
- Ensure user has correct permissions

---

## Production Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user configured
- [ ] Network access configured (0.0.0.0/0)
- [ ] Backend deployed to Railway
- [ ] Environment variables set
- [ ] Backend domain generated
- [ ] First admin user created
- [ ] Register endpoint disabled
- [ ] Frontend API URL updated
- [ ] Frontend deployed to Railway
- [ ] Frontend domain generated
- [ ] CORS configured
- [ ] All features tested
- [ ] Rate limiting enabled
- [ ] Security headers added
- [ ] Monitoring set up
- [ ] Backup strategy in place

---

## Cost Estimate (Railway Free Tier)

Railway Free Tier includes:
- $5 in free credits per month
- Suitable for development and small projects
- May need paid plan for production (starts at $5/month per service)

MongoDB Atlas Free Tier (M0):
- 512 MB storage
- Shared RAM
- No credit card required
- Sufficient for small to medium sites

---

## Support Resources

- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- Railway Discord: https://discord.gg/railway
- Project Issues: [GitHub repository issues]

---

🎉 **Congratulations!** Your Premium Wood Brand website is now live!

Test URL: https://your-app.railway.app
Admin Panel: https://your-app.railway.app/admin/login
