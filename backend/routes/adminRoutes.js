const express = require("express");
const {
  createEmployee,
  getEmployees,
  deleteEmployee
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/employees", protect, allowRoles("admin"), createEmployee);
router.get("/employees", protect, allowRoles("admin"), getEmployees);
router.delete("/employees/:id", protect, allowRoles("admin"), deleteEmployee);

module.exports = router;