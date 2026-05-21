const MenuItem = require("../models/MenuItem");
const Canteen = require("../models/Canteen");

const getMenuByCanteen = async (req, res) => {
  try {
    const { canteenId } = req.params;

    const canteen = await Canteen.findById(canteenId);

    if (!canteen) {
      return res.status(404).json({
        message: "Canteen not found"
      });
    }

    const menuItems = await MenuItem.find({
      canteen: canteenId,
      isAvailable: true
    }).sort({ createdAt: -1 });

    res.json({
      message: "Menu fetched successfully",
      canteen,
      menuItems
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch menu",
      error: error.message
    });
  }
};

const getEmployeeMenu = async (req, res) => {
  try {
    if (!req.user.canteen) {
      return res.status(400).json({
        message: "Employee is not assigned to any canteen"
      });
    }

    const menuItems = await MenuItem.find({
      canteen: req.user.canteen._id
    }).sort({ createdAt: -1 });

    res.json({
      message: "Employee menu fetched successfully",
      canteen: req.user.canteen,
      menuItems
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee menu",
      error: error.message
    });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable } = req.body;

    if (!req.user.canteen) {
      return res.status(400).json({
        message: "Employee is not assigned to any canteen"
      });
    }

    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required"
      });
    }

    const menuItem = await MenuItem.create({
      canteen: req.user.canteen._id,
      name,
      description,
      price,
      category,
      image,
      isAvailable
    });

    res.status(201).json({
      message: "Menu item created successfully",
      menuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create menu item",
      error: error.message
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    if (menuItem.canteen.toString() !== req.user.canteen._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own canteen menu items"
      });
    }

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Menu item updated successfully",
      menuItem: updatedMenuItem
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update menu item",
      error: error.message
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({
        message: "Menu item not found"
      });
    }

    if (menuItem.canteen.toString() !== req.user.canteen._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your own canteen menu items"
      });
    }

    await MenuItem.findByIdAndDelete(id);

    res.json({
      message: "Menu item deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete menu item",
      error: error.message
    });
  }
};

module.exports = {
  getMenuByCanteen,
  getEmployeeMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
};