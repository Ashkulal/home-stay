const express = require("express");
const router = express.Router();
const { getPeaks, getPeak } = require("../controllers/peakController");

router.get("/", getPeaks);
router.get("/:id", getPeak);

module.exports = router;
