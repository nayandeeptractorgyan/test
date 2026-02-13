const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
    
    const product = new Product({
      ...req.body,
      images,
      dimensions: {
        length: req.body.length,
        width: req.body.width,
        height: req.body.height
      }
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let images = product.images;
    if (req.files && req.files.length > 0) {
      // Delete old images
      product.images.forEach(img => {
        const imagePath = path.join(__dirname, '..', img);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      images = req.files.map(file => `/uploads/products/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        images,
        dimensions: {
          length: req.body.length,
          width: req.body.width,
          height: req.body.height
        }
      },
      { new: true }
    );

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images
    product.images.forEach(img => {
      const imagePath = path.join(__dirname, '..', img);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    });

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
