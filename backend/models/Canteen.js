const mongoose = require("mongoose");

const canteenSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    upiId: {
      type: String,
      default: ""
    },
    upiQrImage: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Canteen", canteenSchema);