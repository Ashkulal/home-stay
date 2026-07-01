const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    getDashboardStats,
    getUsers,
    updateUserRole,
    deleteUser,
    getBookings,
    updateBookingStatus
} = require("../controllers/adminController");

router.use(auth, admin);

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/bookings", getBookings);
router.put("/bookings/:id/status", updateBookingStatus);

module.exports = router;
