const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existingAdmin = await User.findOne({
      email: "admin@campusbite.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "CampusBite Admin",
      email: "admin@campusbite.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("Admin created successfully");
    console.log({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });

    process.exit();
  } catch (error) {
    console.error("Admin seeding failed:", error.message);
    process.exit(1);
  }
};

seedAdmin();