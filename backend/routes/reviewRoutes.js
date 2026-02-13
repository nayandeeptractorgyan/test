const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

// Public routes
router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.createReview);

// Protected routes
router.get('/:id', auth, reviewController.getReviewById);
router.put('/:id', auth, reviewController.updateReviewStatus);
router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
