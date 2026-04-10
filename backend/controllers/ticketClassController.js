const TicketClass = require('../models/TicketClass');

exports.getTicketClasses = async (req, res) => {
  try {
    const query = req.user.role === 'operator' ? { isActive: true } : {};
    const classes = await TicketClass.find(query).sort({ price: 1 });
    res.json({ success: true, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createTicketClass = async (req, res) => {
  try {
    const { name, price, currentSerialNumber, color } = req.body;

    if (!price) {
      return res.status(400).json({ success: false, message: 'Price is required' });
    }

    const ticketClass = await TicketClass.create({
      name: name || `₹${price} Ticket`,
      price,
      currentSerialNumber: currentSerialNumber || 0,
      color: color || '#3B82F6'
    });

    res.status(201).json({ success: true, data: ticketClass, message: 'Ticket class created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.updateTicketClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, currentSerialNumber, color, isActive } = req.body;

    const ticketClass = await TicketClass.findById(id);
    if (!ticketClass) {
      return res.status(404).json({ success: false, message: 'Ticket class not found' });
    }

    if (name !== undefined) ticketClass.name = name;
    if (price !== undefined) ticketClass.price = price;
    if (currentSerialNumber !== undefined) ticketClass.currentSerialNumber = currentSerialNumber;
    if (color !== undefined) ticketClass.color = color;
    if (typeof isActive !== 'undefined') ticketClass.isActive = isActive;

    await ticketClass.save();

    res.json({ success: true, data: ticketClass, message: 'Ticket class updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteTicketClass = async (req, res) => {
  try {
    const { id } = req.params;
    const ticketClass = await TicketClass.findById(id);

    if (!ticketClass) {
      return res.status(404).json({ success: false, message: 'Ticket class not found' });
    }

    await ticketClass.deleteOne();
    res.json({ success: true, message: 'Ticket class deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
