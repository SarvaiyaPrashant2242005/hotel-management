const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel", // 👈 reference to hotel
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["single", "double", "suite", "deluxe"],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    title: {
      type: String,
    },
    sizeSqft: {
      type: Number,
    },
    view: {
      type: String,
    },
    bedType: {
      type: String,
    },
    bathrooms: {
      type: Number,
    },
    mealPlan: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    dealText: {
      type: String,
    },
    taxesAndFees: {
      type: Number,
    },
    strikePrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
