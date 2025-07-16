const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createEventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    date: String,
    location: String,
    time: String,
    eventctg: String,
    language: String,
    duration: Number,
    agelimit: Number,
    price: String,
    image: String,
    registrations: [
        {
            name: String,
            designation: String,
            organisation: String,
            email: String,
            officialEmail: String,
            phone: Number,
            location: String,
            linkedin: String,
            registeredAt: { type: Date, default: Date.now }
        }
    ]
});

const createEvent = mongoose.model("createEvent", createEventSchema);
module.exports = createEvent;
