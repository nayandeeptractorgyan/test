const Review = require('../models/Review');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const { approved } = req.query;
    let filter = {};
    if (approved !== undefined) filter.approved = approved === 'true';

    const reviews = await Review.find(filter).populate('product', 'name').sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single review
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('product', 'name');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create review
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully. It will be published after approval.', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve/Disapprove review
exports.updateReviewStatus = async (req, res) => {
  try {
    const { approved } = req.body;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review status updated successfully', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
