# Premium Indian Custom Wood Brand - Full Stack Web Application

A complete production-ready full-stack web application for a Premium Indian Custom Wood Brand featuring a public website and professional SaaS-style admin dashboard.

## 🚀 Features

### Public Website
- **Home Page**: Hero section, featured products, testimonials, CTA sections
- **Products**: Product catalog with filtering by category
- **Product Detail**: Image gallery, specifications, customization options
- **Custom Order**: Detailed form for custom furniture requests
- **Reviews**: Customer testimonials with rating system
- **Blog**: Articles about woodworking, design tips, and updates
- **About**: Company story and values
- **Contact**: Contact form with FAQ section
- **WhatsApp Integration**: Floating button for instant messaging
- **Lead Popup**: Modal form for quick inquiries

### Admin Dashboard
- **Dashboard**: Overview with stats and recent activity
- **Products Management**: Add, edit, delete products with image upload
- **Custom Orders**: View and manage customer orders with status updates
- **Leads Management**: Track and manage customer inquiries
- **Reviews**: Approve/reject customer reviews
- **Blog Management**: Create and manage blog posts
- **JWT Authentication**: Secure admin access

## 🛠 Tech Stack

### Frontend
- React JS (Create React App)
- React Router (v6)
- Axios (API calls)
- Custom CSS (Premium dark wood theme with gold accents)
- Fully responsive design

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads

## 📁 Project Structure

```
premium-wood-brand/
├── backend/
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   ├── CustomOrder.js
│   │   ├── Lead.js
│   │   ├── Review.js
│   │   └── Blog.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── leadController.js
│   │   ├── reviewController.js
│   │   ├── blogController.js
│   │   └── dashboardController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── blogRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/
│   │   ├── products/
│   │   └── blogs/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── public/
│   │   │   │   ├── Navbar.js
│   │   │   │   ├── Footer.js
│   │   │   │   ├── WhatsAppButton.js
│   │   │   │   └── LeadModal.js
│   │   │   └── admin/
│   │   │       ├── AdminSidebar.js
│   │   │       ├── AdminNavbar.js
│   │   │       └── AdminLayout.js
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── Home.js
│   │   │   │   ├── Products.js
│   │   │   │   ├── ProductDetail.js
│   │   │   │   ├── CustomOrder.js
│   │   │   │   ├── Reviews.js
│   │   │   │   ├── Blog.js
│   │   │   │   ├── BlogDetail.js
│   │   │   │   ├── About.js
│   │   │   │   └── Contact.js
│   │   │   └── admin/
│   │   │       ├── AdminLogin.js
│   │   │       ├── AdminDashboard.js
│   │   │       ├── AdminProducts.js
│   │   │       ├── AddProduct.js
│   │   │       ├── EditProduct.js
│   │   │       ├── AdminOrders.js
│   │   │       ├── AdminLeads.js
│   │   │       ├── AdminReviews.js
│   │   │       ├── AdminBlog.js
│   │   │       └── AddBlog.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── PrivateRoute.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd premium-wood-brand
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/premium-wood-brand
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
```

**Important**: For production, use a strong JWT_SECRET and MongoDB Atlas URI.

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Create First Admin User

You need to create the first admin user. You can do this in two ways:

**Option 1: Using API endpoint directly**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@premiumwood.com",
    "password": "admin123",
    "name": "Admin User"
  }'
```

**Option 2: Using MongoDB shell or Compass**
Or create directly in MongoDB after hashing the password with bcrypt.

**⚠️ Security Note**: After creating the first admin, you should protect or remove the `/api/auth/register` endpoint in production.

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or for development with auto-reload:
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will open at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Admin Panel: http://localhost:3000/admin/login

## 🌐 Deployment to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository (recommended)

### Backend Deployment

1. **Prepare Backend**
   - Ensure all code is committed to Git
   - Make sure `server.js` uses `process.env.PORT`

2. **Create Railway Project**
   - Go to Railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure Backend Service**
   - Railway will auto-detect Node.js
   - Set root directory to `/backend` if using monorepo
   - Add environment variables:
     ```
     MONGODB_URI=<your-mongodb-atlas-uri>
     JWT_SECRET=<strong-secret-key>
     NODE_ENV=production
     ```

4. **Add MongoDB**
   - In Railway, add a new service
   - Search for "MongoDB" plugin
   - Railway will auto-configure connection

5. **Deploy**
   - Railway will automatically deploy
   - Note the deployment URL (e.g., `https://your-app.railway.app`)

### Frontend Deployment

1. **Update API URL**
   - In `frontend/src/services/api.js`, update:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.railway.app/api';
   ```

2. **Build for Production**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy to Railway**
   - Create a new service in Railway
   - Deploy from same GitHub repo
   - Set root directory to `/frontend`
   - Railway will detect React app and build automatically

4. **Configure Environment**
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

### Alternative: Deploy Frontend to Vercel/Netlify

**Vercel:**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
cd frontend
npm run build
# Upload `build` folder to Netlify
```

## 🔒 Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas with authentication
- [ ] Enable CORS only for your domain
- [ ] Remove or protect `/api/auth/register` endpoint
- [ ] Use HTTPS for all connections
- [ ] Set secure HTTP headers
- [ ] Implement rate limiting
- [ ] Add input validation and sanitization
- [ ] Regular security updates

## 📱 Admin Panel Access

Default login (after creating admin):
- URL: `your-domain.com/admin/login`
- Email: admin@premiumwood.com
- Password: admin123

**⚠️ Change these credentials immediately in production!**

## 🎨 Customization

### Update Brand Colors
Edit `frontend/src/App.css`:
```css
:root {
  --primary-dark: #1a0f0a;
  --gold: #d4af37;
  /* ... other colors */
}
```

### Update WhatsApp Number
Edit `frontend/src/components/public/WhatsAppButton.js`:
```javascript
const phoneNumber = '919876543210'; // Your number
```

### Update Contact Information
Edit various components in `frontend/src/pages/public/`

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally
- Check MONGODB_URI in .env
- For Atlas, whitelist your IP address

### CORS Errors
- Verify frontend proxy in `package.json`
- Check CORS configuration in `backend/server.js`

### Image Upload Issues
- Ensure `uploads` directories exist
- Check file permissions
- Verify Multer configuration

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📄 API Endpoints

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/orders` - Create custom order
- `POST /api/leads` - Create lead
- `GET /api/reviews?approved=true` - Get approved reviews
- `POST /api/reviews` - Submit review
- `GET /api/blogs?published=true` - Get published blogs
- `GET /api/blogs/slug/:slug` - Get blog by slug

### Protected Endpoints (Require JWT)
- `POST /api/auth/login` - Admin login
- `GET /api/dashboard/stats` - Dashboard statistics
- All admin CRUD operations for products, orders, leads, reviews, blogs

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Email: support@premiumwood.com

## 📝 License

This project is proprietary software. All rights reserved.

## 👨‍💻 Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Code Quality
```bash
# Run linter
npm run lint

# Format code
npm run format
```

---

Built with ❤️ for Premium Wood Crafts
