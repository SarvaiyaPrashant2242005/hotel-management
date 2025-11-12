const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes
router.put("/update", verifyToken, userController.update);
router.delete("/delete/:id", verifyToken, userController.delete);

// Example: Admin can delete any user
router.delete("/admin/delete/:id", verifyToken, isAdmin, userController.delete);

module.exports = router;
