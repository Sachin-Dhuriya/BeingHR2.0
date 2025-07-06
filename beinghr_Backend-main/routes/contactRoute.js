const express = require('express');
const router = express.Router();
const contactForm = require('../models/contactForm.js');
require('dotenv').config();

router.post("/contact/form", async (req, res) => {
    try {
        let { name, email, phone, message } = req.body;
        let form = new contactForm({ name, email, phone, message });
        await form.save();
        res.json({ success: true, message: "Form submitted successfully!" });
    } catch (err) {
        console.error("Error saving form:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

router.get("/contact/form", async (req, res) => {
    try {
        let userQuery = await contactForm.find();
        res.json(userQuery);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

module.exports = router