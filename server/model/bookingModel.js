const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },

    // booking lifecycle
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    // payment info
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentOption: {
      type: String,
      enum: ["pay-now", "pay-at-hotel"],
      default: "pay-now",
    },
    advancePayment: {
      type: Number,
      default: 0,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    razorpayRefundId: {
      type: String,
    },

    // cancellation info
    cancellationReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ["none", "initiated", "processed", "failed"],
      default: "none",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);