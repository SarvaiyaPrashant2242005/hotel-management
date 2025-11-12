const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

const userController = {
  // 🟢 REGISTER
  register: async (req, res) => {
    try {
      const { fullName, email, password, contactNo, address, role } = req.body;

      if (!fullName || !email || !password || !contactNo || !address) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword,
        contactNo,
        address,
        role: role || "user",
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // 🟢 LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });

      const user = await userModel.findOne({ email });
      if (!user)
        return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user._id, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // 🟢 UPDATE USER
  update: async (req, res) => {
    try {
      const userId = req.user.id; // from token
      const { fullName, contactNo, address } = req.body;

      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { fullName, contactNo, address },
        { new: true }
      );

      if (!updatedUser)
        return res.status(404).json({ message: "User not found" });

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // 🟢 DELETE USER (Admin or Self)
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (req.user.role !== "admin" && req.user.id !== id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const deletedUser = await userModel.findByIdAndDelete(id);
      if (!deletedUser)
        return res.status(404).json({ message: "User not found" });

      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = userController;
