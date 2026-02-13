# Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

### Step 2: Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/premium-wood-brand
JWT_SECRET=your_secret_key_12345
NODE_ENV=development
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Windows
net start MongoDB

# Linux
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update MONGODB_URI in .env

### Step 4: Create Admin User

```bash
# Start backend first
cd backend
npm start

# In another terminal, create admin
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin"
  }'
```

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 6: Access the Application

- **Public Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login
  - Email: admin@test.com
  - Password: admin123

## ✅ What to Do Next

1. **Add Products**: Go to Admin → Products → Add New Product
2. **Create Blog Posts**: Go to Admin → Blog → Add New Blog
3. **Test Features**: 
   - Submit a custom order on public site
   - Submit a review
   - Submit a lead through contact form
4. **Customize**: Update colors, logos, contact info

## 🎯 Testing Checklist

- [ ] Can access public website
- [ ] Can login to admin panel
- [ ] Can add a product with images
- [ ] Can submit custom order (public)
- [ ] Can submit review (public)
- [ ] Can view dashboard stats
- [ ] WhatsApp button works

## 🐛 Common Issues

**Port already in use:**
```bash
# Kill process on port 5000
# macOS/Linux: lsof -ti:5000 | xargs kill
# Windows: netstat -ano | findstr :5000

# Or change port in backend/.env
PORT=5001
```

**MongoDB connection failed:**
```bash
# Check if MongoDB is running
# macOS/Linux: ps aux | grep mongod
# Windows: tasklist | findstr mongo

# Or use MongoDB Atlas (cloud)
```

**Images not uploading:**
```bash
# Ensure upload directories exist
mkdir -p backend/uploads/products
mkdir -p backend/uploads/blogs
```

## 📚 Next Steps

- Read full [README.md](README.md) for detailed documentation
- Check API endpoints documentation
- Learn about deployment options
- Customize the theme and branding

---

Need help? Check the troubleshooting section in README.md
