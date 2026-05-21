const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Canteen = require("../models/Canteen");

dotenv.config();

const seedCanteens = async () => {
  try {
    await connectDB();

    await Canteen.deleteMany();

    const canteens = await Canteen.insertMany([
      {
        name: "Main Canteen",
        location: "Near Main Block",
        upiId: "maincanteen@upi",
        upiQrImage: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=maincanteen@upi"
      },
      {
        name: "Mini Canteen",
        location: "Near Library",
        upiId: "minicanteen@upi",
        upiQrImage: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=minicanteen@upi"
      }
    ]);

    console.log("Canteens seeded successfully");
    console.log(canteens);

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedCanteens();