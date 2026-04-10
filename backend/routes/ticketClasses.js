const express = require('express');
const router = express.Router();
const { getTicketClasses, createTicketClass, updateTicketClass, deleteTicketClass } = require('../controllers/ticketClassController');
const { authenticate, requireSuperadmin } = require('../middleware/auth');

router.get('/', authenticate, getTicketClasses);
router.post('/', authenticate, requireSuperadmin, createTicketClass);
router.put('/:id', authenticate, requireSuperadmin, updateTicketClass);
router.delete('/:id', authenticate, requireSuperadmin, deleteTicketClass);

module.exports = router;
