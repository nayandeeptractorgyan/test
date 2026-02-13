const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Register admin (first time setup - should be protected in production)
router.post('/register', authController.registerAdmin);

// Login admin
router.post('/login', authController.loginAdmin);

// Get admin profile
router.get('/profile', auth, authController.getAdminProfile);

module.exports = router;
