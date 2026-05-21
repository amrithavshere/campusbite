const Canteen = require("../models/Canteen");

const getCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find({ isActive: true }).sort({ createdAt: 1 });

    res.json({
      message: "Canteens fetched successfully",
      canteens
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch canteens",
      error: error.message
    });
  }
};

const createCanteen = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Canteen name is required"
      });
    }

    const canteen = await Canteen.create({
      name,
      location
    });

    res.status(201).json({
      message: "Canteen created successfully",
      canteen
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create canteen",
      error: error.message
    });
  }
};

module.exports = {
  getCanteens,
  createCanteen
};