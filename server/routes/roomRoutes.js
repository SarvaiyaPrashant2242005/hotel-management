
const express = require("express");
const router = express.Router();
const roomController = require("../controller/roomController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// 🏠 Create room (Admin only)
router.post("/", verifyToken, isAdmin, roomController.createRoom);

// 📋 Get all rooms
router.get("/", roomController.getAllRooms);

// 🔍 Get single room by ID
router.get("/:id", roomController.getRoomById);

// 🏠 Get rooms by hotel ID
router.get("/hotel/:hotelId", roomController.getRoomsByHotelId);

// ✏️ Update room (Admin only)
router.put("/:id", verifyToken, isAdmin, roomController.updateRoom);

// ❌ Delete room (Admin only)
router.delete("/:id", verifyToken, isAdmin, roomController.deleteRoom);

module.exports = router;
