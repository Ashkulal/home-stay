const express = require("express");
const router = express.Router();
const { getGalleryImages, getGalleryImage } = require("../controllers/galleryController");

router.get("/", getGalleryImages);
router.get("/:id", getGalleryImage);

module.exports = router;
