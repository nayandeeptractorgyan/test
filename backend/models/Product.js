const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Furniture', 'Decor', 'Custom', 'Doors', 'Tables', 'Chairs', 'Cabinets', 'Others']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  wood_type: {
    type: String,
    required: true
  },
  dimensions: {
    length: String,
    width: String,
    height: String
  },
  images: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  inStock: {
    type: Boolean,
    default: true
  },
  customizable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
