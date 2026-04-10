const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketClassId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TicketClass',
    required: [true, 'Ticket class is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  serialNumber: {
    type: Number,
    required: [true, 'Serial number is required']
  },
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Operator is required']
  },
  isVoided: {
    type: Boolean,
    default: false
  },
  voidedAt: {
    type: Date
  },
  voidedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for faster queries
ticketSchema.index({ createdAt: -1 });
ticketSchema.index({ operatorId: 1, createdAt: -1 });
ticketSchema.index({ ticketClassId: 1, createdAt: -1 });

module.exports = mongoose.model('Ticket', ticketSchema);
