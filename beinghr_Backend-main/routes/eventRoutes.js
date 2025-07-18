const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const Event = require('../models/createevent');
require('dotenv').config();

const router = express.Router();

// 🔹 Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 🔹 Multer Storage Setup (Uploads Directly to Cloudinary)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'events',  // Folder name in Cloudinary
        format: async (req, file) => 'png', // Convert all images to PNG
        public_id: (req, file) => Date.now() + '-' + file.originalname
    }
});

const upload = multer({ storage });

// 🔹 GET All Events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});


router.post('/add-event', upload.single('image'), async (req, res) => {
    try {
        const { 
            title, 
            description, 
            date, 
            location, 
            time, 
            eventctg, 
            language, 
            duration, 
            agelimit, 
            price 
        } = req.body;

        const imageUrl = req.file ? req.file.path : null;

        // Creating the event object
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            time,
            eventctg,
            language,
            duration,
            agelimit,
            price,
            image: imageUrl // Cloudinary image URL
        });

        // Save to the database
        await newEvent.save();
        res.status(201).json({ message: 'Event added successfully!', imageUrl });
    } catch (error) {
        console.error('Error while adding event:', error.message);
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// 🔹 PUT Route for Updating Event (with image upload support)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const eventId = req.params.id;
        const {
            title,
            description,
            date,
            location,
            time,
            eventctg,
            language,
            duration,
            agelimit,
            price
        } = req.body;

        // Check if new image uploaded
        const imageUrl = req.file ? req.file.path : undefined;

        // Build update object dynamically
        const updateData = {
            title,
            description,
            date,
            location,
            time,
            eventctg,
            language,
            duration,
            agelimit,
            price
        };

        if (imageUrl) {
            updateData.image = imageUrl;
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({ message: 'Event updated successfully', updatedEvent });
    } catch (error) {
        console.error('Error while updating event:', error.message);
        res.status(500).json({ message: 'Failed to update event' });
    }
});

module.exports = router;
