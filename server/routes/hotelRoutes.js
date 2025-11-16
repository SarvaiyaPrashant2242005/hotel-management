const express = require("express");
const router = express.Router();
const hotelController = require("../controller/hotelController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// 🏨 Create a new hotel (only admin can do this)
router.post("/", verifyToken, isAdmin, hotelController.createHotel);

// 📋 Get all hotels (open for all)
router.get("/", hotelController.getAllHotels);

// 🔍 Get single hotel by ID
router.get("/:id", hotelController.getHotelById);

// ✏️ Update hotel
router.put("/:id", verifyToken, isAdmin, hotelController.updateHotel);

// ❌ Delete hotel
router.delete("/:id", verifyToken, isAdmin, hotelController.deleteHotel);

module.exports = router;
    