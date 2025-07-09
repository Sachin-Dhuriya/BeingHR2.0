const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const HomeCard= require('../models/homeCard')
require('dotenv').config();

const router = express.Router();

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer + Cloudinary Storage Setup
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'homepage-section',
        format: async (req, file) => 'png',
        public_id: (req, file) => Date.now() + '-' + file.originalname
    }
});

const upload = multer({ storage });

// Create a Home Card (Admin Only)
router.post('/cards', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!req.file || !title || !content) {
            return res.status(400).json({ message: "Image, title, and content are required." });
        }

        // Cloudinary URL will be in req.file.path
        const image = req.file.path;

        const newCard = new HomeCard({ image, title, content });
        await newCard.save();

        res.status(201).json({ message: "Card created successfully.", card: newCard });
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ message: error.message });
    }
});


// Get All Home Cards 
router.get('/cards', async (req, res) => {
    try {
        const cards = await HomeCard.find();
        res.status(200).json(cards);
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ message: error.message });
    }
});

// Update card
router.put('/cards/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, content } = req.body;
        const card = await HomeCard.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'Card not found.' });

        card.title = title;
        card.content = content;
        if (req.file) {
            card.image = req.file.path;
        }

        await card.save();
        res.status(200).json({ message: "Card updated", card });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete card
router.delete('/cards/:id', async (req, res) => {
    try {
        await HomeCard.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Card deleted.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;