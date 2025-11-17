
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const router = express.Router();
const roomController = require("../controller/roomController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

const uploadsDir = path.join(__dirname, "..", "uploads", "rooms");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, "");
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, base + "-" + unique + ext);
  },
});

const upload = multer({ storage });

// 🏠 Create room (Admin only)
router.post("/", verifyToken, isAdmin, upload.array("images", 10), roomController.createRoom);

// 📋 Get all rooms
router.get("/", roomController.getAllRooms);

// 🏠 Get rooms by hotel ID
router.get("/hotel/:hotelId", roomController.getRoomsByHotelId);

// 🔍 Get single room by ID
router.get("/:id", roomController.getRoomById);

// ✏️ Update room (Admin only)
router.put("/:id", verifyToken, isAdmin, roomController.updateRoom);

// ❌ Delete room (Admin only)
router.delete("/:id", verifyToken, isAdmin, roomController.deleteRoom);

module.exports = router;
