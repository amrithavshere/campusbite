const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Canteen = require("../models/Canteen");

dotenv.config();

const seedEmployees = async () => {
  try {
    await connectDB();

    const mainCanteen = await Canteen.findOne({ name: "Main Canteen" });
    const miniCanteen = await Canteen.findOne({ name: "Mini Canteen" });

    if (!mainCanteen || !miniCanteen) {
      console.log("Canteens not found. Run seedCanteens.js first.");
      process.exit(1);
    }

    await User.deleteMany({ role: "employee" });

    const hashedPassword = await bcrypt.hash("123456", 10);

    const employees = await User.insertMany([
      {
        name: "Main Canteen Employee",
        email: "maincanteen@example.com",
        password: hashedPassword,
        role: "employee",
        canteen: mainCanteen._id
      },
      {
        name: "Mini Canteen Employee",
        email: "minicanteen@example.com",
        password: hashedPassword,
        role: "employee",
        canteen: miniCanteen._id
      }
    ]);

    console.log("Employees seeded successfully");
    console.log(employees);

    process.exit();
  } catch (error) {
    console.error("Employee seeding failed:", error.message);
    process.exit(1);
  }
};

seedEmployees();