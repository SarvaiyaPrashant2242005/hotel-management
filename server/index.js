const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes"); // ✅ fixed typo (userRotes → userRoutes)

dotenv.config(); // Load environment variables

const app = express();

// 🧩 Middleware
app.use(express.json()); // Parse incoming JSON requests

// 🗄️ Connect to MongoDB
connectDB();

// 🧭 Routes
app.use("/api/users", userRoutes); // added /api prefix for clarity

// 🌍 Default route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "API is running for HMS 🚀",
  });
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
