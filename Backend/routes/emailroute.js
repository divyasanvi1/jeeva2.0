const express = require("express");
const { resendVerificationEmail } = require("../controllers/user");
const router = express.Router();
const User = require("../models/userModel"); // Adjust the path if needed

// routes/userRoute.js
router.get('/verify/:id', async (req, res) => {
    try {
      const user = await User.findOne({ verificationToken: req.params.id });
  
      // If user not found or token is invalid
      if (!user) {
        return res.status(400).send(`
          <html>
            <head><title>Verification Failed</title></head>
            <body style="text-align:center; font-family:sans-serif; padding-top:50px;">
              <h1>Invalid or expired verification link.</h1>
              <p>Please request a new verification email.</p>
            </body>
          </html>
        `);
      }
  
      // Check if token has expired
      if (Date.now() > user.tokenExpiry) {
        return res.status(400).send(`
          <html>
            <head><title>Token Expired</title></head>
            <body style="text-align:center; font-family:sans-serif; padding-top:50px;">
              <h1>⏰ This verification link has expired.</h1>
              <p>Please request a new one.</p>
            </body>
          </html>
        `);
      }
  
      // Token valid, verify user
      user.isVerified = true;
      user.verificationToken = undefined;
      user.tokenExpiry = undefined; // clear expiry as well
      await user.save();
  
      return res.send(`
        <html>
          <head><title>Email Verified</title></head>
          <body style="text-align:center; font-family:sans-serif; padding-top:50px;">
            <h1>✅ Your email has been verified!</h1>
            <p>You can now <a href="http://localhost:3000/login">log in</a> to your account.</p>
          </body>
        </html>
      `);
    } catch (err) {
      console.error(err);
      return res.status(500).send(`
        <html>
          <head><title>Server Error</title></head>
          <body style="text-align:center; font-family:sans-serif; padding-top:50px;">
            <h1>Something went wrong.</h1>
            <p>Please try again later.</p>
          </body>
        </html>
      `);
    }
  });
  
router.post("/resend-verification", resendVerificationEmail);


module.exports = router;
