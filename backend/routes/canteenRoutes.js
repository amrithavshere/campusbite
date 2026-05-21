const express = require("express");
const {
  getCanteens,
  createCanteen
} = require("../controllers/canteenController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getCanteens);
router.post("/", protect, allowRoles("admin"), createCanteen);

module.exports = router;