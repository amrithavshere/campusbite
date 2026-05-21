const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Canteen = require("../models/Canteen");

dotenv.config();

const updateCanteenQr = async () => {
  try {
    await connectDB();

    await Canteen.findOneAndUpdate(
      { name: "Main Canteen" },
      {
        upiId: "maincanteen@upi",
        upiQrImage:
          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=maincanteen@upi"
      }
    );

    await Canteen.findOneAndUpdate(
      { name: "Mini Canteen" },
      {
        upiId: "minicanteen@upi",
        upiQrImage:
          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=minicanteen@upi"
      }
    );

    console.log("Canteen QR details updated successfully");
    process.exit();
  } catch (error) {
    console.error("Failed to update canteen QR details:", error.message);
    process.exit(1);
  }
};

updateCanteenQr();