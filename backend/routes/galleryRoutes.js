const express = require("express");
const router = express.Router();

const {
    getGalleryImages,
    getGalleryImage,
    uploadImage,
    deleteImage
} = require("../controllers/galleryController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getGalleryImages);
router.get("/:id", getGalleryImage);

// Admin Routes
router.post("/", auth, admin, uploadImage);
router.delete("/:id", auth, admin, deleteImage);

module.exports = router;
