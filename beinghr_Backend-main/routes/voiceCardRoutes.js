const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const VoiceCard = require('../models/voiceCard');
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
        folder: 'voice-cards',
        format: async (req, file) => 'png',
        public_id: (req, file) => Date.now() + '-' + file.originalname
    }
});

const upload = multer({ storage });

/* ------------ POST Create VoiceCard ------------ */
router.post('/voicecard', upload.single('image'), async (req, res) => {
    try {
        const { name, designation, companyName, content } = req.body;

        if (!req.file || !name || !designation || !companyName || !content) {
            return res.status(400).json({ message: "All fields including image are required." });
        }

        const image = req.file.path;  // Cloudinary URL

        const newVoiceCard = new VoiceCard({
            image,
            name,
            designation,
            companyName,
            content
        });

        await newVoiceCard.save();

        res.status(201).json({ message: "Voice Card created successfully.", data: newVoiceCard });
    } catch (error) {
        console.error("Error creating VoiceCard:", error);
        res.status(500).json({ message: error.message });
    }
});

/* ------------ GET All VoiceCards ------------ */
router.get('/voicecard', async (req, res) => {
    try {
        const cards = await VoiceCard.find();
        res.status(200).json(cards);
    } catch (error) {
        console.error("Error fetching VoiceCards:", error);
        res.status(500).json({ message: error.message });
    }
});

/* ------------ PUT Update VoiceCard ------------ */
router.put('/voicecard/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, designation, companyName, content } = req.body;
        const card = await VoiceCard.findById(req.params.id);
        if (!card) return res.status(404).json({ message: 'VoiceCard not found.' });

        card.name = name;
        card.designation = designation;
        card.companyName = companyName;
        card.content = content;
        if (req.file) {
            card.image = req.file.path;
        }

        await card.save();
        res.status(200).json({ message: "VoiceCard updated successfully.", data: card });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ------------ DELETE VoiceCard ------------ */
router.delete('/voicecard/:id', async (req, res) => {
    try {
        await VoiceCard.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'VoiceCard deleted successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
