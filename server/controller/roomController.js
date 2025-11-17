const Room = require("../model/roomModel");
const Hotel = require("../model/hotelModel");

const roomController = {
  // 🏠 Create room for a hotel
  createRoom: async (req, res) => {
    try {
      const {
        hotel,
        roomNumber,
        type,
        price,
        capacity,
        amenities,
        title,
        sizeSqft,
        view,
        bedType,
        bathrooms,
        mealPlan,
        taxesAndFees,
        strikePrice,
        dealText,
      } = req.body;

      let parsedAmenities = amenities;
      if (typeof parsedAmenities === "string") {
        try {
          const json = JSON.parse(parsedAmenities);
          parsedAmenities = Array.isArray(json)
            ? json
            : String(parsedAmenities)
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean);
        } catch (e) {
          parsedAmenities = String(parsedAmenities)
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean);
        }
      }

      const images = (req.files || []).map(
        (file) => `/uploads/rooms/${file.filename}`
      );

      // Check if hotel exists
      const existingHotel = await Hotel.findById(hotel);
      if (!existingHotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      // Check duplicate roomNumber
      const existingRoom = await Room.findOne({ roomNumber });
      if (existingRoom) {
        return res.status(400).json({ message: "Room number already exists" });
      }

      const newRoom = await Room.create({
        hotel,
        roomNumber,
        type,
        price,
        capacity,
        amenities,
        title,
        sizeSqft,
        view,
        bedType,
        bathrooms,
        mealPlan,
        images,
        taxesAndFees,
        strikePrice,
        dealText,
      });

      res.status(201).json({
        message: "Room created successfully",
        room: newRoom,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 📋 Get all rooms
  getAllRooms: async (req, res) => {
    try {
      const rooms = await Room.find().populate("hotel", "name city");
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔍 Get room by ID
  getRoomById: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id).populate("hotel", "name city");
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.status(200).json(room);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✏️ Update room
  updateRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.status(200).json({ message: "Room updated", room });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ❌ Delete room
  deleteRoom: async (req, res) => {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getRoomsByHotelId  : async (req, res) => {
  try {
    const { hotelId } = req.params;
    const rooms = await Room.find({ hotel: hotelId }).populate("hotel", "name city state");
    
    if (!rooms.length) {
      return res.status(404).json({ message: "No rooms found for this hotel" });
    }

    res.status(200).json({
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error("Error fetching rooms by hotel:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
};

module.exports = roomController;
