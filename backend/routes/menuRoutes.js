const express = require("express");
const {
  getMenuByCanteen,
  getEmployeeMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require("../controllers/menuController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/canteen/:canteenId", protect, getMenuByCanteen);

router.get("/employee/my-menu", protect, allowRoles("employee"), getEmployeeMenu);

router.post("/", protect, allowRoles("employee"), createMenuItem);

router.put("/:id", protect, allowRoles("employee"), updateMenuItem);

router.delete("/:id", protect, allowRoles("employee"), deleteMenuItem);

module.exports = router;