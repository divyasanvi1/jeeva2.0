// routes/booking.js
const express = require("express");
const router = express.Router();
const { createBooking, getUserBookings } = require("../controllers/booking");

router.post("/create", createBooking);
router.get("/user/:userId", getUserBookings);

module.exports = router;
