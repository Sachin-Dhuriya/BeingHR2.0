const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Blog = require('../models/blog');

// POST: Create new blog post
router.post('/blog', async (req, res) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBlog = new Blog({
      title,
      content,
      author,
      date: Date.now(), // Optional: defaults automatically
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET: Fetch all blog posts (admin)
router.get('/blog', async (req, res) => {
  try {
    const blogs = await Blog.find(); // fetch all blogs
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST: Approve blog by ID (with ObjectId validation)
router.post('/approveblog/:id', async (req, res) => {
  try {
    const blogId = req.params.id;

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.isApprove = true;
    const updatedBlog = await blog.save();

    res.status(200).json({ message: 'Blog approved successfully', blog: updatedBlog });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE: Delete blog post by ID (admin)
router.delete('/:id', async (req, res) => {
  try {
    const blogId = req.params.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: 'Invalid blog ID' });
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found or already deleted' });
    }

    res.status(200).json({ message: 'Blog deleted successfully', blog: deletedBlog });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET: Fetch only approved blogs (for frontend display)
router.get('/blog/approve', async (req, res) => {
  try {
    const approveBlog = await Blog.find({ isApprove: true }); // only approved blogs
    res.status(200).json(approveBlog);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/blog/:id/comment
router.post('/blog/:id/comment', async (req, res) => {
  try {
    console.log('Incoming body:', req.body);
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({ message: "Text and author are required." });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    blog.comments.push({ text, author });
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// GET /api/blog/:id/comments
router.get('/blog/:id/comments', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/blog/:id/like
router.post('/blog/:id/like', async (req, res) => {
  try {
    // Make sure user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userId = req.user._id;  // get current user ID
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Check if user already liked
    const alreadyLiked = blog.likedBy.includes(userId);
    if (alreadyLiked) {
      return res.status(400).json({ message: 'You have already liked this post' });
    }

    // Add user to likedBy and increment likes
    blog.likedBy.push(userId);
    blog.likes = blog.likes + 1;
    await blog.save();

    res.json({ success: true, message: 'Blog liked successfully!', likes: blog.likes, likedBy: blog.likedBy });
  } catch (error) {
    console.error('Error liking blog:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



module.exports = router;
