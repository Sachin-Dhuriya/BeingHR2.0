const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const HomePageContainerSection = require('../models/homepageContainer');
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

// 📌 POST Route to handle section upload
// 📌 POST Route to handle section upload (replaces old data & images)
router.post('/admin/homepage-section', upload.array('images', 10), async (req, res) => {
    try {
        const { title, content } = req.body;
        const files = req.files;

        // Validate image count
        if (!files || files.length !== 10) {
            return res.status(400).json({ error: 'Exactly 10 images must be uploaded.' });
        }

        // 1. Find existing document
        const existingDoc = await HomePageContainerSection.findOne({});

        // 2. If it exists, delete old images from Cloudinary
        if (existingDoc && existingDoc.images && existingDoc.images.length > 0) {
    for (const img of existingDoc.images) {
        try {
            // Extract full public_id from the URL by removing base Cloudinary URL
            const url = new URL(img.url);
            const pathParts = url.pathname.split('/'); // e.g., /v1700000000/homepage-section/1234567890-name.png
            const folderIndex = pathParts.indexOf('homepage-section');
            const publicIdParts = pathParts.slice(folderIndex, pathParts.length); // ['homepage-section', '1234567890-name.png']
            const publicIdWithExt = publicIdParts.join('/'); // 'homepage-section/1234567890-name.png'
            const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); // removes .png or .jpg etc

            await cloudinary.uploader.destroy(publicId);
            console.log(`✅ Deleted: ${publicId}`);
        } catch (err) {
            console.error('❌ Error deleting image:', img.url, err.message);
        }
    }
}


        // 3. Map new images into { url, caption }
        const images = files.map((file, index) => ({
            url: file.path,
            caption: `Image ${index + 1}`
        }));

        // 4. Upsert the document (replace the old one)
        const homepageSection = await HomePageContainerSection.findOneAndUpdate(
            {},
            {
                title,
                content,
                images,
                updatedAt: Date.now()
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ message: 'Homepage section updated successfully!', homepageSection });
    } catch (error) {
        console.error('Error uploading homepage section:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});



// 📌 GET Route to retrieve homepage section
router.get('/admin/homepage-section', async (req, res) => {
    try {
        const homepageSection = await HomePageContainerSection.findOne({});

        if (!homepageSection) {
            return res.status(404).json({ message: 'Homepage section not found.' });
        }

        res.status(200).json({ homepageSection });
    } catch (error) {
        console.error('Error fetching homepage section:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;
