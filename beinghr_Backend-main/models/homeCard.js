const mongoose = require('mongoose');

const homeCardSchema = new mongoose.Schema({
    image: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('homeCard', homeCardSchema);