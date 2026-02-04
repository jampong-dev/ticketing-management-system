const express = require('express');
const router = express.Router();

const  { createTicket, getAllTickets, getMyTickets, getTicketById, updateTicket, updateStatus, deleteTicket } = require('../../controllers/ticket');
const { authenticate, authorize } = require('../../middleware');


router.use(authenticate);
router.get('/', authorize('ADMIN'), getAllTickets);
router.get('/my-tickets', getMyTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.put('/:id', authorize('ADMIN', 'USER'), updateTicket);
router.put('/:id/status', authorize('ADMIN'), updateStatus);
router.delete('/:id', authorize('ADMIN', 'USER'), deleteTicket);

module.exports = router;