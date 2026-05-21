const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
require("../models/User");
require("../models/Canteen");

const createOrder = async (req, res) => {
  try {
    const { canteenId, items, paymentMode } = req.body;

    if (!canteenId || !items || items.length === 0) {
      return res.status(400).json({
        message: "Canteen and items are required"
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);

      if (!menuItem) {
        return res.status(404).json({
          message: "Menu item not found"
        });
      }

      if (menuItem.canteen.toString() !== canteenId) {
        return res.status(400).json({
          message: "Menu item does not belong to selected canteen"
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          message: `${menuItem.name} is currently not available`
        });
      }

      const quantity = item.quantity || 1;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity
      });

      totalAmount += menuItem.price * quantity;
    }

    const order = await Order.create({
      customer: req.user._id,
      canteen: canteenId,
      items: orderItems,
      totalAmount,
      status: "Pending",
      billNumber: `CB-${Date.now()}`,
      paymentMode: paymentMode || "Cash at Counter",
      billStatus: "Pending",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to place order",
      error: error.message
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("canteen", "name location upiId upiQrImage")
      .sort({ createdAt: -1 });

    res.json({
      message: "My orders fetched successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch my orders",
      error: error.message
    });
  }
};

const getEmployeeOrders = async (req, res) => {
  try {
    if (!req.user.canteen) {
      return res.status(400).json({
        message: "Employee is not assigned to any canteen"
      });
    }

    const orders = await Order.find({ canteen: req.user.canteen._id })
      .populate("customer", "name email role")
      .populate("canteen", "name location")
      .sort({ createdAt: -1 });

    res.json({
      message: "Employee orders fetched successfully",
      orders
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee orders",
      error: error.message
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Preparing", "Ready", "Completed", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.canteen.toString() !== req.user.canteen._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own canteen orders"
      });
    }

    order.status = status;
    await order.save();

    if (status === "Ready") {
      const io = req.app.get("io");

    io.to(order.customer.toString()).emit("orderReady", {
      message: "Your order is ready for pickup",
      orderId: order._id,
      status: order.status
    });
  }

  res.json({
    message: "Order status updated successfully",
    order
  });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message
    });
  }
};
const updateBillStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { billStatus } = req.body;

    const allowedBillStatuses = ["Pending", "Paid"];

    if (!allowedBillStatuses.includes(billStatus)) {
      return res.status(400).json({
        message: "Invalid bill status"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    if (order.canteen.toString() !== req.user.canteen._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own canteen bills"
      });
    }

    order.billStatus = billStatus;
    await order.save();

    res.json({
      message: "Bill status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update bill status",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getEmployeeOrders,
  updateOrderStatus,
  updateBillStatus
};