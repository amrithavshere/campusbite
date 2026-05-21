const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Canteen = require("../models/Canteen");

const createEmployee = async (req, res) => {
  try {
    const { name, email, password, canteenId } = req.body;

    if (!name || !email || !password || !canteenId) {
      return res.status(400).json({
        message: "Name, email, password and canteen are required"
      });
    }

    const canteen = await Canteen.findById(canteenId);

    if (!canteen) {
      return res.status(404).json({
        message: "Canteen not found"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      canteen: canteenId
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        canteen: {
          id: canteen._id,
          name: canteen.name,
          location: canteen.location
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create employee",
      error: error.message
    });
  }
};

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" })
      .select("-password")
      .populate("canteen", "name location")
      .sort({ createdAt: -1 });

    res.json({
      message: "Employees fetched successfully",
      employees
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message
    });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findById(id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found"
      });
    }

    if (employee.role !== "employee") {
      return res.status(400).json({
        message: "Only employee accounts can be deleted from here"
      });
    }

    await User.findByIdAndDelete(id);

    res.json({
      message: "Employee deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete employee",
      error: error.message
    });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  deleteEmployee
};