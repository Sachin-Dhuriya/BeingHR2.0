const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, required: true }, // could also be ObjectId if you have users
  date: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  isApprove: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  comments: [commentSchema], // ⬅️ add this field
  likes: { type: Number, default: 0 }, // ✅ added
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Blog', blogSchema);
