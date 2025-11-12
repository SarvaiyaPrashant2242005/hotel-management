const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Hotel name is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
    },
    state: {
      type: String,
      required: [true, "State is required"],
    },
    country: {
      type: String,
      required: [true, "Country is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to user who created the hotel
      required: true,
    },
    images: [
      {
        type: String, // store URLs of images (optional for now)
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hotel", hotelSchema);
