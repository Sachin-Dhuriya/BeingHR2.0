const express = require('express');
const passport = require('passport');
const nodemailer = require("nodemailer");
const router = express.Router();
//-----------------------------------Nodemailer----------------------------------
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



const sendLoginEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Login Successful - BeingHR",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f2f4f8; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.1); padding: 40px;">
    
    <div style="text-align: center;">
      <h2 style="color: #2ecc71; font-size: 28px; margin-bottom: 10px;">🎉 You're In, ${name}!</h2>
      <p style="color: #333; font-size: 16px; margin-top: 0;">
        Welcome to <strong>BeingHR</strong> — we’re thrilled to have you on board!
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

    <div style="font-size: 16px; color: #444;">
      <p>This is a confirmation that you've successfully logged in.</p>
      <p>Your journey with us starts now — get ready for exciting updates, valuable opportunities, and exclusive events curated just for you.</p>
      <p>If you didn't perform this login, please take action immediately.</p>
    </div>

    <div style="margin-top: 30px; text-align: center;">
      <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 12px 24px; background-color: #2ecc71; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
        VISIT US
      </a>
    </div>

    <div style="margin-top: 40px; color: #888; font-size: 14px; text-align: center;">
      <p>We're here to support you every step of the way.</p>
      <p><strong>— The BeingHR Team</strong></p>
    </div>
  </div>
</div>

      `,
    });
    console.log(`Login email sent to ${email}`);
  } catch (error) {
    console.error("Error sending login email:", error);
  }
};

// @desc    Auth with Google
// @route   GET /auth/google
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      const { email, name } = req.user;
      if (req.user._isNewUser) {
        await sendLoginEmail(email, name);
      }

      // Redirect after login
      res.redirect(`${process.env.FRONTEND_URL}`);
    } catch (error) {
      console.error("Login callback error:", error);
      res.redirect(`${process.env.FRONTEND_URL}?error=login_failed`);
    }
  }
);


// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect(process.env.FRONTEND_URL); // Redirect to frontend
    });
  });
});

// @desc    Get current user
// @route   GET /auth/user
router.get('/user', (req, res) => {
  res.send(req.user); // Sends user details to frontend
});

module.exports = router;
