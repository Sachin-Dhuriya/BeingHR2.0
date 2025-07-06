const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: '',
  }
});

const homepageContainerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String, // You can render it as HTML if needed
    required: true,
  },
  images: {
    type: [imageSchema],
    validate: [arrayLimit, '{PATH} must have exactly 10 images']
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

function arrayLimit(val) {
  return val.length === 10;
}

module.exports = mongoose.model('HomePageContainerSection', homepageContainerSchema);
