const Booking = require("../model/bookingModel");
const Room = require("../model/roomModel");

const bookingController = {
  // Create a new booking for logged-in user
  createBooking: async (req, res) => {
    try {
      const { hotelId, roomId, checkIn, checkOut, totalPrice } = req.body;

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

     const booking = await Booking.create({
  user: req.user.id,
  hotel: hotelId,
  room: roomId,
  checkIn: new Date(checkIn),
  checkOut: new Date(checkOut),
  totalPrice,
  status: "confirmed",
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
};

module.exports = bookingController;