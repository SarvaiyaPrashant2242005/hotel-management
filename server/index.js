const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const cors = require("cors"); // 🧩 Import CORS
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const roomRoutes = require("./routes/roomRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

dotenv.config(); // Load environment variables

const app = express();

// 🧩 Middleware
app.use(express.json()); // Parse incoming JSON requests

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Enable CORS for your frontend origin
app.use(
  cors({
    origin: ["http://localhost:8080", "https://hotel-management-rose-zeta.vercel.app", "https://wonderpath.pages.dev"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you use cookies or authentication
  })
);

// 🗄️ Connect to MongoDB
connectDB();

// 🧭 Routes
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);


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
