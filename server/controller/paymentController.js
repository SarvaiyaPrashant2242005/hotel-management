const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../model/bookingModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentController = {
  // Create Razorpay order for a booking
  createOrder: async (req, res) => {
    try {
      const { bookingId } = req.body;

      if (!bookingId) {
        return res.status(400).json({ message: "bookingId is required" });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized for this booking" });
      }

      // amount in paise
      const amount = Math.round(booking.totalPrice * 100);

      const options = {
        amount,
        currency: "INR",
        receipt: `booking_${booking._id}`,
      };

      const order = await razorpay.orders.create(options);

      // store order id in booking
      booking.razorpayOrderId = order.id;
      booking.paymentStatus = "pending";
      await booking.save();

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        bookingId: booking._id,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ message: "Failed to create order", error: error.message });
    }
  },

  // Verify payment signature and mark booking as paid
  verifyPayment: async (req, res) => {
    try {
      const {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        bookingId,
      } = req.body;

      if (
        !razorpay_payment_id ||
        !razorpay_order_id ||
        !razorpay_signature ||
        !bookingId
      ) {
        return res.status(400).json({ message: "Missing payment details" });
      }

      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized for this booking" });
      }

      // verify signature
      const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(sign)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        booking.paymentStatus = "failed";
        await booking.save();
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      booking.razorpayOrderId = razorpay_order_id;
      booking.razorpayPaymentId = razorpay_payment_id;
      booking.razorpaySignature = razorpay_signature;
      await booking.save();

      res.json({
        message: "Payment verified successfully",
        booking,
      });
    } catch (error) {
      console.error("Error verifying Razorpay payment:", error);
      res.status(500).json({ message: "Payment verification failed", error: error.message });
    }
  },
};

module.exports = paymentController;