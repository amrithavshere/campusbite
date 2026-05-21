const express = require("express");
const {
  createOrder,
  getMyOrders,
  getEmployeeOrders,
  updateOrderStatus,
  updateBillStatus
} = require("../controllers/orderController");

const { protect } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, allowRoles("student", "staff"), createOrder);

router.get("/my-orders", protect, allowRoles("student", "staff"), getMyOrders);

router.get("/employee", protect, allowRoles("employee"), getEmployeeOrders);

router.put("/:id/status", protect, allowRoles("employee"), updateOrderStatus);

router.put("/:id/bill-status", protect, allowRoles("employee"), updateBillStatus);

module.exports = router;