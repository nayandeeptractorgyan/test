const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const { uploadProduct } = require('../middleware/upload');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes
router.post('/', auth, uploadProduct.array('images', 5), productController.createProduct);
router.put('/:id', auth, uploadProduct.array('images', 5), productController.updateProduct);
router.delete('/:id', auth, productController.deleteProduct);

module.exports = router;
