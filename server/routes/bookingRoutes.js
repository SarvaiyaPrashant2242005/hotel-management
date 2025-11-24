const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// User creates a booking
router.post("/", verifyToken, bookingController.createBooking);

// Logged-in user's bookings
router.get("/me", verifyToken, bookingController.getMyBookings);

// User cancels their own booking
router.put("/:id/cancel", verifyToken, bookingController.cancelBooking);

// Admin: all bookings
router.get("/", verifyToken, isAdmin, bookingController.getAllBookings);

// Admin: update booking status
router.put("/:id/status", verifyToken, isAdmin, bookingController.updateBookingStatus);

// Admin: mark payment as received offline
router.put("/:id/mark-payment-offline", verifyToken, isAdmin, bookingController.markPaymentOffline);

module.exports = router;