const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventRegFormSchema = new Schema({
    name: { type: String, required: true },
    designation: { type: String, required: true },
    organisation: { type: String, required: true },
    email: { type: String },
    officialEmail: { type: String, required: true },   // renamed for clarity
    phone: { type: Number, required: true },
    location: { type: String, required: true },
    linkedin: { type: String },
    eventName: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now }
});

const eventRegForm = mongoose.model("eventRegForm", eventRegFormSchema);
module.exports = eventRegForm;
