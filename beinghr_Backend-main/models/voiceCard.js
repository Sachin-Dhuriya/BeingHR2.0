const mongoose = require('mongoose');

const voiceCardSchema = new mongoose.Schema({
    image: {
        type: String, // Will store the filename or Cloudinary URL
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('VoiceCard', voiceCardSchema);
