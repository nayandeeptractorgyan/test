const mongoose = require('mongoose');

const ticketClassSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [1, 'Price must be at least 1']
  },
  currentSerialNumber: {
    type: Number,
    required: [true, 'Serial number is required'],
    min: [0, 'Serial number cannot be negative']
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual for display name
ticketClassSchema.virtual('displayName').get(function() {
  return this.name || `₹${this.price} Ticket`;
});

module.exports = mongoose.model('TicketClass', ticketClassSchema);
