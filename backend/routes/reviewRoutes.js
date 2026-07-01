const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getReviews, createReview, deleteReview } = require("../controllers/reviewController");

router.get("/", getReviews);
router.post("/", auth, createReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;
