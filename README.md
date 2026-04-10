# 🅿️ ParkTicket — Parking Ticket Management System

A full-stack production-grade parking ticket management system built with **Node.js + Express + MongoDB + React**.

---

## 📁 Project Structure

```
parking-system/
├── backend/
│   ├── config/
│   │   ├── database.js        # MongoDB connection
│   │   └── seed.js            # Initial data seeder
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── ticketClassController.js
│   │   ├── ticketController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── auth.js            # JWT auth + role guard
│   ├── models/
│   │   ├── User.js
│   │   ├── TicketClass.js
│   │   └── Ticket.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── ticketClasses.js
│   │   ├── tickets.js
│   │   └── reports.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   └── PrintSlip.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── OperatorPanel.js
    │   │   └── admin/
    │   │       ├── AdminLayout.js
    │   │       ├── AdminDashboard.js
    │   │       ├── UsersPage.js
    │   │       ├── TicketClassesPage.js
    │   │       ├── ReportsPage.js
    │   │       └── LiveMonitorPage.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

## 🚀 Setup Instructions

### 1. Clone / extract the project

```bash
cd parking-system
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parking_system
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Seed the database:
```bash
npm run seed
```

Start the backend:
```bash
npm run dev     # development (with nodemon)
# or
npm start       # production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The app opens at `http://localhost:3000`

---

## 🔑 Login Credentials (after seed)

| Role       | Username     | Password  |
|------------|-------------|-----------|
| Superadmin | superadmin  | admin123  |
| Operator 1 | operator1   | op123     |
| Operator 2 | operator2   | op123     |

---

## 🎟️ Initial Ticket Classes (after seed)

| Class       | Price | Starting Serial |
|-------------|-------|----------------|
| ₹5 Ticket   | ₹5    | 600            |
| ₹10 Ticket  | ₹10   | 400            |
| ₹20 Ticket  | ₹20   | 211            |
| ₹100 Ticket | ₹100  | 6              |

---

## 📡 API Reference

### Auth
| Method | Route              | Access | Description    |
|--------|--------------------|--------|----------------|
| POST   | /api/auth/login    | Public | Login          |
| GET    | /api/auth/me       | Auth   | Get current user |
| PUT    | /api/auth/change-password | Auth | Change password |

### Users (Superadmin only)
| Method | Route          | Description      |
|--------|----------------|------------------|
| GET    | /api/users     | List operators   |
| POST   | /api/users     | Create operator  |
| PUT    | /api/users/:id | Update operator  |
| DELETE | /api/users/:id | Delete operator  |

### Ticket Classes
| Method | Route                   | Access     | Description       |
|--------|-------------------------|------------|-------------------|
| GET    | /api/ticket-classes     | Auth       | List all classes  |
| POST   | /api/ticket-classes     | Superadmin | Create class      |
| PUT    | /api/ticket-classes/:id | Superadmin | Update class      |
| DELETE | /api/ticket-classes/:id | Superadmin | Delete class      |

### Tickets
| Method | Route               | Description          |
|--------|---------------------|----------------------|
| POST   | /api/tickets/issue  | Issue ticket (atomic) |
| GET    | /api/tickets        | List tickets (paginated) |
| GET    | /api/tickets/last   | Get last ticket      |
| PUT    | /api/tickets/:id/void | Void a ticket      |

### Reports (Superadmin only)
| Method | Route                | Description        |
|--------|----------------------|--------------------|
| GET    | /api/reports         | Get report data    |
| GET    | /api/reports/export  | Export as Excel    |

**Report filter params:** `filter` (daily/range/monthly/yearly), `startDate`, `endDate`, `month`, `year`, `operatorId`

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (salt rounds: 10)
- **JWT** authentication (24h expiry)
- **Role-based** middleware on every protected route
- Serial number increment uses **atomic `$inc`** (race-condition proof)
- Operators can only void their own tickets within 30 minutes

---

## 🖨️ Printing

- After ticket submission, a print slip appears
- Click **Print** or it auto-triggers `window.print()`
- Print CSS isolates only the slip for clean output
- Compatible with standard and thermal printers

---

## 📊 Reports Features

- Filter by: Daily / Date Range / Monthly / Yearly
- Filter by specific operator
- Breakdown by ticket class and operator
- Revenue trend chart
- **Export to .xlsx** with summary + full ticket list sheets

---

## ⌨️ Operator Keyboard Shortcuts

| Key     | Action              |
|---------|---------------------|
| `Enter` | Submit selected ticket |
| `Esc`   | Cancel selection    |

---

## 🛠️ Production Deployment Tips

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET` (32+ random chars)
3. Use MongoDB Atlas for hosted database
4. Build frontend: `npm run build` → serve with nginx or Express static
5. Use PM2 to manage the Node.js process: `pm2 start server.js`

---

## 📦 Tech Stack

| Layer    | Technology           |
|----------|---------------------|
| Backend  | Node.js + Express   |
| Database | MongoDB + Mongoose  |
| Auth     | JWT + bcryptjs      |
| Frontend | React 18            |
| Charts   | Recharts            |
| Export   | ExcelJS             |
| Toasts   | react-hot-toast     |
| Routing  | React Router v6     |
