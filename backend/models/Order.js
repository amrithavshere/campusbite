const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    canteen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Canteen",
      required: true
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem"
        },
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    totalAmount: {
  type: Number,
  required: true,
  min: 0
},
    billNumber: {
      type: String,
      unique: true
    },
    paymentMode: {
      type: String,
      enum: ["Cash at Counter", "UPI"],
      default: "Cash at Counter"
    },
    billStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending"
    },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Completed", "Cancelled"],
      default: "Pending"
    },
    billNumber: {
    type: String,
    unique: true
  },
  paymentMode: {
    type: String,
    enum: ["Cash at Counter", "UPI"],
    default: "Cash at Counter"
  },
  billStatus: {
    type: String,
    enum: ["Pending", "Paid"],
    default: "Pending"
  }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);