const express = require('express');
const router = express.Router();
const { issueTicket, getTickets, voidTicket, getLastTicket } = require('../controllers/ticketController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.post('/issue', issueTicket);
router.get('/', getTickets);
router.get('/last', getLastTicket);
router.put('/:id/void', voidTicket);

module.exports = router;
