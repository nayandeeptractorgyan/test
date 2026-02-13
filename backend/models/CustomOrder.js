const mongoose = require('mongoose');

const customOrderSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  product_type: {
    type: String,
    required: true
  },
  wood_preference: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  reference_images: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomOrder', customOrderSchema);
