const Booking = require("../model/bookingModel");
const Room = require("../model/roomModel");

const bookingController = {
  // Create a new booking for logged-in user
  createBooking: async (req, res) => {
    try {
      const { 
        hotelId, 
        roomId, 
        checkIn, 
        checkOut, 
        totalPrice,
        paymentOption,
        advancePayment 
      } = req.body;

      if (!hotelId || !roomId || !checkIn || !checkOut || !totalPrice) {
        return res
          .status(400)
          .json({ message: "hotelId, roomId, checkIn, checkOut, totalPrice are required" });
      }

      // Make sure room exists
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Optional: basic availability check (no overlapping bookings with confirmed status)
      const overlapping = await Booking.findOne({
        room: roomId,
        status: { $ne: "cancelled" },
        $or: [
          {
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) },
          },
        ],
      });

      if (overlapping) {
        return res.status(409).json({
          message: "Room is already booked for the selected dates",
        });
      }

      // Create booking with pending status (will be confirmed after payment)
      const booking = await Booking.create({
        user: req.user.id,
        hotel: hotelId,
        room: roomId,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        totalPrice,
        status: "pending", // Changed from "confirmed" to "pending"
        paymentOption: paymentOption || "pay-now",
        advancePayment: advancePayment || 0,
      });

      // Re-load with populate instead of calling populate on the created instance
      const populated = await Booking.findById(booking._id)
        .populate("hotel", "name city state country")
        .populate("room", "roomNumber type");

      res.status(201).json({
        message: "Booking created successfully",
        booking: populated,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  },

  // Get bookings for logged-in user
  getMyBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ user: req.user.id })
        .populate("hotel", "name city state country")
        .populate("room", "roomNumber type price")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Admin: get all bookings
  getAllBookings: async (req, res) => {
    try {
      const bookings = await Booking.find()
        .populate("user", "fullName email")
        .populate("hotel", "name city state country")
        .populate("room", "roomNumber type price")
        .sort({ createdAt: -1 });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Admin: update booking status
  updateBookingStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.status = status;
      await booking.save();

      res.json({
        message: "Booking status updated successfully",
        booking,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // User: cancel their own booking
  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const booking = await Booking.findById(id)
        .populate("hotel", "name")
        .populate("room", "roomNumber type");

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Verify user owns this booking
      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to cancel this booking" });
      }

      // Check if already cancelled
      if (booking.status === "cancelled") {
        return res.status(400).json({ message: "Booking is already cancelled" });
      }

      // Update booking status
      booking.status = "cancelled";
      booking.cancellationReason = reason || "";
      booking.cancelledAt = new Date();

      // Handle refund if payment was made
      let refundInfo = null;
      if (booking.paymentStatus === "paid" && booking.razorpayPaymentId) {
        try {
          // Calculate refund amount
          const refundAmount = booking.paymentOption === "pay-at-hotel" 
            ? (booking.advancePayment || Math.round(booking.totalPrice * 0.1))
            : booking.totalPrice;

          // Initiate Razorpay refund
          const Razorpay = require("razorpay");
          const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
          });

          const refund = await razorpay.payments.refund(booking.razorpayPaymentId, {
            amount: Math.round(refundAmount * 100), // Amount in paise
            speed: "normal",
            notes: {
              bookingId: booking._id.toString(),
              reason: reason || "User cancellation",
            },
          });

          // Update booking with refund info
          booking.refundAmount = refundAmount;
          booking.refundStatus = "initiated";
          booking.razorpayRefundId = refund.id;

          refundInfo = {
            amount: refundAmount,
            status: "initiated",
            estimatedDays: "5-7",
            refundId: refund.id,
          };
        } catch (refundError) {
          console.error("Refund initiation failed:", refundError);
          booking.refundStatus = "failed";
          // Still cancel the booking but notify about refund failure
          await booking.save();
          return res.status(500).json({
            message: "Booking cancelled but refund initiation failed. Please contact support.",
            error: refundError.message,
            booking,
          });
        }
      }

      await booking.save();

      const message = refundInfo
        ? `Booking cancelled successfully. Refund of ₹${refundInfo.amount.toLocaleString()} has been initiated and will be processed within ${refundInfo.estimatedDays} business days.`
        : "Booking cancelled successfully.";

      res.json({
        message,
        booking,
        refund: refundInfo,
      });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ message: "Failed to cancel booking", error: error.message });
    }
  },
};

module.exports = bookingController;