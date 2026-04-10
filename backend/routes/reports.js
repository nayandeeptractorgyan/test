const express = require('express');
const router = express.Router();
const { getReport, exportExcel } = require('../controllers/reportController');
const { authenticate, requireSuperadmin } = require('../middleware/auth');

router.use(authenticate, requireSuperadmin);

router.get('/', getReport);
router.get('/export', exportExcel);

module.exports = router;
