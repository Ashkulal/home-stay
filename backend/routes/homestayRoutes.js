const express = require("express");
const router = express.Router();
const { getHomestays, getHomestay } = require("../controllers/homestayController");

router.get("/", getHomestays);
router.get("/:id", getHomestay);

module.exports = router;
