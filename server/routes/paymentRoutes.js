const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const { verifyToken } = require("../middlewares/authMiddleware");

// User: create order for booking
router.post("/create-order", verifyToken, paymentController.createOrder);

// User: verify payment after Razorpay callback/success
router.post("/verify", verifyToken, paymentController.verifyPayment);

module.exports = router;