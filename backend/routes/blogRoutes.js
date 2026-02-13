const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middleware/auth');
const { uploadBlog } = require('../middleware/upload');

// Public routes
router.get('/', blogController.getAllBlogs);
router.get('/slug/:slug', blogController.getBlogBySlug);
router.get('/:id', blogController.getBlogById);

// Protected routes
router.post('/', auth, uploadBlog.single('featured_image'), blogController.createBlog);
router.put('/:id', auth, uploadBlog.single('featured_image'), blogController.updateBlog);
router.delete('/:id', auth, blogController.deleteBlog);

module.exports = router;
