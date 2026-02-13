const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, published } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (published !== undefined) filter.published = published === 'true';

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single blog
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get blog by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create blog
exports.createBlog = async (req, res) => {
  try {
    const featured_image = req.file ? `/uploads/blogs/${req.file.filename}` : '';
    
    const blog = new Blog({
      ...req.body,
      featured_image,
      tags: req.body.tags ? JSON.parse(req.body.tags) : []
    });

    await blog.save();
    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    let featured_image = blog.featured_image;
    if (req.file) {
      // Delete old image
      const imagePath = path.join(__dirname, '..', blog.featured_image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
      featured_image = `/uploads/blogs/${req.file.filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        featured_image,
        tags: req.body.tags ? JSON.parse(req.body.tags) : blog.tags
      },
      { new: true }
    );

    res.json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete image
    const imagePath = path.join(__dirname, '..', blog.featured_image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
