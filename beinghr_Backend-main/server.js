//---------------------------------------Requiring Express-------------------------------------------------
const express = require('express');
const app = express();
const passport = require('passport');
const session = require("express-session");
require('dotenv').config();
require('./config/passport');
const authRoutes = require('./routes/auth');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require("cors");
const User = require("./models/User"); // Ensure correct case

const cron = require("node-cron");
const moment = require("moment"); // optional, helps with date math; install with: npm install moment


//---------------------------------------NodeMailer Setup-------------------------------------------------
const nodemailer = require("nodemailer");

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail", // You can use any email service provider
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email app password
    },
});

// Function to send confirmation email
const sendConfirmationEmail = async (email, name, eventName) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER, // Your sender email
            to: email,
            subject: `You're Registered for ${eventName}! 🎉`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #4CAF50; text-align: center;">🎉 Registration Confirmed!</h2>
                        <p style="font-size: 16px;">Dear <strong>${name}</strong>,</p>
                        <p style="font-size: 16px;">We are thrilled to confirm your registration for <strong>${eventName}</strong>! 🥳</p>
                        <p style="font-size: 16px;">Get ready for an exciting experience! We can't wait to see you there.</p>
                        <p style="font-size: 16px;">Stay tuned for further updates and event details.</p>
                        <br />
                        <p style="font-size: 16px;">Warm regards,</p>
                        <p style="font-size: 16px; font-weight: bold;">The BeingHR Team</p>
                        <p style="font-size: 14px; color: #777777; text-align: center;">If you have any questions, feel free to contact us.</p>
                    </div>
                </div>
            `,
        });
        console.log(`Confirmation email sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};


//----------------------------------------Reminder---------------------------------------------------------
// Function to send reminder email
// Reminder: 1 day before
const sendOneDayReminderEmail = async (email, name, eventName, eventDate) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `⏰ Just 1 day to go: ${eventName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #FF9800; text-align: center;">⏰ Event is Tomorrow!</h2>
                        <p style="font-size: 16px;">Hi <strong>${name}</strong>,</p>
                        <p style="font-size: 16px;">We’re excited to remind you that <strong>${eventName}</strong> is happening tomorrow on <strong>${eventDate}</strong>! 🎉</p>
                        <p style="font-size: 16px;">Get ready and mark your calendar!</p>
                        <br />
                        <p style="font-size: 16px;">See you soon,</p>
                        <p style="font-size: 16px; font-weight: bold;">The BeingHR Team</p>
                    </div>
                </div>
            `,
        });
        console.log(`1 day reminder email sent to ${email}`);
    } catch (error) {
        console.error("Error sending 1 day reminder email:", error);
    }
};

// Reminder: 1 hour before
const sendOneHourReminderEmail = async (email, name, eventName, eventDate) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🚀 Just 1 hour left for: ${eventName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
                        <h2 style="color: #FF5722; text-align: center;">🚀 Almost Time!</h2>
                        <p style="font-size: 16px;">Hey <strong>${name}</strong>,</p>
                        <p style="font-size: 16px;">Just a quick reminder: <strong>${eventName}</strong> is starting in 1 hour on <strong>${eventDate}</strong>! 🎉</p>
                        <p style="font-size: 16px;">We can’t wait to see you there. Make sure to join on time!</p>
                        <br />
                        <p style="font-size: 16px;">Cheers,</p>
                        <p style="font-size: 16px; font-weight: bold;">The BeingHR Team</p>
                    </div>
                </div>
            `,
        });
        console.log(`1 hour reminder email sent to ${email}`);
    } catch (error) {
        console.error("Error sending 1 hour reminder email:", error);
    }
};



//---------------------------------------Connect to MongoDB-------------------------------------------------
async function main() {
    await mongoose.connect(process.env.MONGO_URL)
}
main().then(() => { console.log('Connection Successful.........') }).catch(err => console.log(err));

//---------------------------------------Requiring Models---------------------------------------------------
const contactForm = require('./models/contactForm.js');
const eventRegForm = require('./models/eventRegForm.js');
const createEvent = require("./models/createevent.js");

//---------------------------------------Middleware--------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware (Should be before session)
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

// Session Middleware
app.use(
    session({
        secret: process.env.COOKIE_KEY || "your_secret_key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Set to true in production (HTTPS required)
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/uploads', express.static('uploads')); // Serve uploaded images

//---------------------------------------Routers--------------------------------------------------------------
const eventRoutes = require('./routes/eventRoutes.js');
app.use('/api/events', eventRoutes);

//-------------------------------------Contact Form Route----------------------------------------------
const contactRoute = require('./routes/contactRoute.js')
app.use('/api', contactRoute)

//--------------------------------------HomePage Container------------------------------------------------
const homepageContainer = require('./routes/homepageContainer.js')
app.use('/api', homepageContainer)
//--------------------------------------Home Card------------------------------------------------
const homepagCard = require('./routes/homeCard.js')
app.use('/api/admin', homepagCard)
//--------------------------------------Voice Cards------------------------------------------------
const voiceCardRoutes = require('./routes/voiceCardRoutes.js')
app.use('/api/admin', voiceCardRoutes);
//--------------------------------------Blog Post------------------------------------------------
const blogRoutes = require('./routes/blogRoutes');
app.use('/api/admin', blogRoutes)
//-------------------------------------Event Registration Form Route----------------------------------------------
app.post("/eventregistration", async (req, res) => {
    try {
        console.log(req.body);
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const {
            name,
            designation,
            organisation,
            officialEmail,
            phone,
            location,
            linkedin,
            eventName,
            eventId
        } = req.body;

        // Check if already registered
        const existingRegistration = await eventRegForm.findOne({ officialEmail, eventName });
        if (existingRegistration) {
            return res.status(400).json({ message: "You have already registered for this event." });
        }

        // Save to eventRegForm
        const eventReg = new eventRegForm({
            name,
            designation,
            organisation,
            officialEmail,
            phone,
            location,
            linkedin,
            eventName,
            email: req.body.email
        });
        await eventReg.save();

        // Add to event's registrations array
        const event = await createEvent.findById(eventId);
        if (event) {
            event.registrations.push({
                name,
                designation,
                organisation,
                email: req.user.email,  // make sure 'email' exists on req.user
                officialEmail,
                phone,
                location,
                linkedin,
            });
            await event.save();
        }

        // Add event to user's registeredEvents array
        const user = await User.findById(req.user._id);
        if (!user.registeredEvents.includes(eventId)) {
            user.registeredEvents.push(eventId);
            await user.save();
        }

        // Send confirmation email
        await sendConfirmationEmail(req.user.email, name, eventName);

        return res.status(200).json({ message: "Registered for the event successfully!" });

    } catch (err) {
        console.error("Error in registration:", err);
        return res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
});

app.get("/eventregistration", async (req, res) => {
    try {
        let registrationDetails = await eventRegForm.find();
        res.json(registrationDetails);
    } catch (error) {
        console.error("Error fetching registrations:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});


app.get('/allevent',async(req,res)=>{
    try {

        let data = await createEvent.find();
        res.json(data)
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
    }
})

// PUT /events/:id
app.put('/events/:id', async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // update with fields sent from frontend
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


//----------------------------------------Reminder----------------------------------------------------------------------
// Track sent reminders to avoid duplicate emails
const sentReminders = new Set();

// Cron job: runs every minute
cron.schedule("* * * * *", async () => {
    console.log("⏰ Checking for upcoming event reminders...");

    try {
        const events = await createEvent.find();
        const now = new Date();

        events.forEach(async (event) => {
            const combinedDateTime = `${event.date}T${event.time}:00`; 
            const eventDate = new Date(combinedDateTime);
            if (!eventDate || isNaN(eventDate)) return;

            const diffMs = eventDate - now;
            const diffHours = diffMs / (1000 * 60 * 60);

            const oneDayBeforeKey = `${event._id}_1d`;
            const oneHourBeforeKey = `${event._id}_1h`;

            if (diffHours <= 24 && diffHours > 0 && !sentReminders.has(oneDayBeforeKey)) {
                // Send 1 day reminder
                for (const reg of event.registrations) {
                    await sendOneDayReminderEmail(
                        reg.email,
                        reg.name,
                        event.title,
                        moment(eventDate).format('LLLL')
                    );
                }
                sentReminders.add(oneDayBeforeKey);
                console.log(`✅ Sent 1 day reminder for event: ${event.title}`);
            }

            if (diffHours <= 1 && diffHours > 0 && !sentReminders.has(oneHourBeforeKey)) {
                // Send 1 hour reminder
                for (const reg of event.registrations) {
                    await sendOneHourReminderEmail(
                        reg.email,
                        reg.name,
                        event.title,
                        moment(eventDate).format('LLLL')
                    );
                }
                sentReminders.add(oneHourBeforeKey);
                console.log(`✅ Sent 1 hour reminder for event: ${event.title}`);
            }
        });
    } catch (error) {
        console.error("Error checking reminders:", error);
    }
});




//--------------------------------------Event Details Route----------------------------------------------------------------
app.get("/eventdetails", async (req, res) => {
    try {
        const eventData = await createEvent.find();
        if (!eventData || eventData.length === 0) {
            return res.status(404).json({ success: false, message: "No events found." });
        }
        res.status(200).json({ success: true, data: eventData });
    } catch (error) {
        console.error("Error fetching event details:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
});

//--------------------------------------Event Details Show Route----------------------------------------------------------------
app.get("/eventdetails/:id", async (req, res) => {
    try {
        const event = await createEvent.findById(req.params.id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.json({
            ...event._doc,
            upcoming: event.upcoming || { cta: "Register Now", date: "TBA", location: "Online" },
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});

//--------------------------------------User Details Show Route----------------------------------------------------------------
app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

//--------------------------------------Get Logged-in User----------------------------------------------------------------
app.get("/user", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    res.status(200).json(req.user);
});


//--------------------------------------Register User for Event----------------------------------------------------------------
app.post("/register-event", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const { eventId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user.registeredEvents.includes(eventId)) {
            user.registeredEvents.push(eventId);
            await user.save();
            return res.json({ success: true, message: "Event registered successfully!" });
        }

        res.json({ success: false, message: "Already registered for this event." });
    } catch (error) {
        console.error("Error registering event:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//--------------------------------------Check Admin----------------------------------------------------------------
app.get("/check-admin", async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not logged in" });
        }
        const user = await User.findById(req.user._id);
        res.json({ isAdmin: user?.isAdmin || false });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



//--------------------------------------auth status----------------------------------------------------------------
app.get("/auth-status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

//---------------------------------------Home Page Card Admin Route--------------------------------------------

//--------------------------------------Listening Port----------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is listening on PORT ${PORT}...`);
});