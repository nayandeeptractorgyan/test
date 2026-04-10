const Ticket = require('../models/Ticket');
const TicketClass = require('../models/TicketClass');

// CRITICAL: Atomic serial number increment to prevent race conditions
exports.issueTicket = async (req, res) => {
  try {
    const { ticketClassId } = req.body;

    if (!ticketClassId) {
      return res.status(400).json({ success: false, message: 'Ticket class ID is required' });
    }

    // Atomically increment serial number - findOneAndUpdate with $inc
    const updatedClass = await TicketClass.findOneAndUpdate(
      { _id: ticketClassId, isActive: true },
      { $inc: { currentSerialNumber: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ success: false, message: 'Ticket class not found or inactive' });
    }

    const ticket = await Ticket.create({
      ticketClassId: updatedClass._id,
      price: updatedClass.price,
      serialNumber: updatedClass.currentSerialNumber,
      operatorId: req.user._id
    });

    // Populate for response
    await ticket.populate('ticketClassId', 'name price color');
    await ticket.populate('operatorId', 'name username');

    res.status(201).json({
      success: true,
      data: ticket,
      message: 'Ticket issued successfully'
    });
  } catch (error) {
    console.error('Issue ticket error:', error);
    res.status(500).json({ success: false, message: 'Failed to issue ticket' });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 50, operatorId, ticketClassId, startDate, endDate, date } = req.query;

    const query = { isVoided: false };

    // Operator can only see their own tickets
    if (req.user.role === 'operator') {
      query.operatorId = req.user._id;
    } else if (operatorId) {
      query.operatorId = operatorId;
    }

    if (ticketClassId) query.ticketClassId = ticketClassId;

    if (date) {
      const d = new Date(date);
      query.createdAt = {
        $gte: new Date(d.setHours(0, 0, 0, 0)),
        $lte: new Date(d.setHours(23, 59, 59, 999))
      };
    } else if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const total = await Ticket.countDocuments(query);
    const tickets = await Ticket.find(query)
      .populate('ticketClassId', 'name price color')
      .populate('operatorId', 'name username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: tickets,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.voidTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (ticket.isVoided) {
      return res.status(400).json({ success: false, message: 'Ticket already voided' });
    }

    // Only allow voiding within last 30 minutes (for operators)
    if (req.user.role === 'operator') {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (ticket.createdAt < thirtyMinutesAgo) {
        return res.status(400).json({ success: false, message: 'Can only void tickets within 30 minutes' });
      }
      if (ticket.operatorId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Can only void your own tickets' });
      }
    }

    ticket.isVoided = true;
    ticket.voidedAt = new Date();
    ticket.voidedBy = req.user._id;
    await ticket.save();

    res.json({ success: true, message: 'Ticket voided successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getLastTicket = async (req, res) => {
  try {
    const query = { isVoided: false };
    if (req.user.role === 'operator') {
      query.operatorId = req.user._id;
    }

    const ticket = await Ticket.findOne(query)
      .populate('ticketClassId', 'name price color')
      .populate('operatorId', 'name username')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
