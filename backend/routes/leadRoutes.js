const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middleware/auth');

// Public route
router.post('/', leadController.createLead);

// Protected routes
router.get('/', auth, leadController.getAllLeads);
router.get('/:id', auth, leadController.getLeadById);
router.put('/:id', auth, leadController.updateLeadStatus);
router.delete('/:id', auth, leadController.deleteLead);

module.exports = router;
