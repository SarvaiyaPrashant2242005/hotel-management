const Hotel = require("../model/hotelModel.js");

const hotelController = {
  // 🏨 Create new hotel
  createHotel: async (req, res) => {
    try {
      const {
        name,
        description,
        address,
        city,
        state,
        country,
        contactNumber,
        images,
      } = req.body;

      // Logged-in user's ID will come from authMiddleware
      const ownerId = req.user.id;

      const hotel = await Hotel.create({
        name,
        description,
        address,
        city,
        state,
        country,
        contactNumber,
        images,
        owner: ownerId,
      });

      res.status(201).json({
        message: "Hotel created successfully",
        hotel,
      });
    } catch (error) {
      console.error("Error creating hotel:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // 📋 Get all hotels (Admin can see all)
  getAllHotels: async (req, res) => {
    try {
      const hotels = await Hotel.find().populate("owner", "fullName email");
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🔍 Get hotel by ID
  getHotelById: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id).populate(
        "owner",
        "fullName email"
      );
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // ✏️ Update hotel
  updateHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      // Only the owner can update
      if (hotel.owner.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this hotel" });
      }

      const updatedFields = req.body;
      Object.assign(hotel, updatedFields);

      const updatedHotel = await hotel.save();

      res.json({
        message: "Hotel updated successfully",
        hotel: updatedHotel,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // 🗑️ Delete hotel
  deleteHotel: async (req, res) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }

      // Only owner can delete
      if (hotel.owner.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this hotel" });
      }

      await hotel.deleteOne();
      res.json({ message: "Hotel deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // get hotel by userid

};

module.exports = hotelController;
