import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function ManageMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [canteen, setCanteen] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Breakfast",
    image: "",
    isAvailable: true
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      setError("");
      const response = await axiosInstance.get("/menu/employee/my-menu");

      setMenuItems(response.data.menuItems);
      setCanteen(response.data.canteen);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      price: Number(formData.price)
    };

    if (editingItemId) {
      await axiosInstance.put(`/menu/${editingItemId}`, payload);
      setSuccess("Menu item updated successfully");
    } else {
      await axiosInstance.post("/menu", payload);
      setSuccess("Menu item added successfully");
    }

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Breakfast",
      image: "",
      isAvailable: true
    });

    setEditingItemId(null);
    fetchMenu();
  } catch (error) {
    setError(
      error.response?.data?.message ||
        (editingItemId ? "Failed to update menu item" : "Failed to add menu item")
    );
  }
};

  const startEdit = (item) => {
  setEditingItemId(item._id);

  setFormData({
    name: item.name,
    description: item.description || "",
    price: item.price,
    category: item.category,
    image: item.image || "",
    isAvailable: item.isAvailable
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const cancelEdit = () => {
  setEditingItemId(null);

  setFormData({
    name: "",
    description: "",
    price: "",
    category: "Breakfast",
    image: "",
    isAvailable: true
  });
};

  const toggleAvailability = async (item) => {
    try {
      setError("");
      setSuccess("");

      await axiosInstance.put(`/menu/${item._id}`, {
        isAvailable: !item.isAvailable
      });

      setSuccess("Menu item availability updated");
      fetchMenu();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update menu item");
    }
  };

  const deleteMenuItem = async (itemId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      await axiosInstance.delete(`/menu/${itemId}`);

      setSuccess("Menu item deleted successfully");
      fetchMenu();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete menu item");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Manage Menu</h2>
      <p className="text-muted">
        {canteen ? `${canteen.name} - ${canteen.location}` : "Your canteen menu"}
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="mb-3">
                {editingItemId ? "Update Menu Item" : "Add Menu Item"}
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Masala Dosa"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Short description"
                    rows="3"
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Example: 45"
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Drinks">Drinks</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="Optional image URL"
                  />
                </div>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    className="form-check-input"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    id="isAvailable"
                  />
                  <label className="form-check-label" htmlFor="isAvailable">
                    Available
                  </label>
                </div>

                <button className="btn btn-orange w-100 fw-semibold">
                  {editingItemId ? "Update Item" : "Add Item"}
                </button>
                {editingItemId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={cancelEdit}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-7">
  <h4 className="mb-3">Current Menu Items</h4>

  {loading && <p>Loading menu...</p>}

  {!loading && menuItems.length === 0 && (
    <div className="alert alert-info">No menu items added yet.</div>
  )}

  {!loading && menuItems.length > 0 && (
    <div className="card app-card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {menuItems.map((item) => (
                <tr key={item._id}>
                  <td style={{ minWidth: "220px" }}>
                    <div className="d-flex align-items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "55px",
                            height: "55px",
                            objectFit: "cover"
                          }}
                          className="rounded"
                        />
                      )}

                      <div>
                        <strong>{item.name}</strong>
                        <div className="small text-soft">
                          {item.description || "No description"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge bg-secondary">
                      {item.category}
                    </span>
                  </td>

                  <td>
                    <strong>₹{item.price}</strong>
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        item.isAvailable ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>

                  <td style={{ minWidth: "180px" }}>
                    <button
                      className={`btn btn-sm me-2 ${
                        item.isAvailable ? "btn-warning" : "btn-success"
                      }`}
                      onClick={() => toggleAvailability(item)}
                    >
                      {item.isAvailable ? "Make Unavailable" : "Make Available"}
                    </button>

                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => startEdit(item)}
                      title="Edit item"
                    >
                      Edit
                    </button>

                    <button
                    className="btn btn-sm btn-outline-danger mt-2 mt-md-0"
                    onClick={() => deleteMenuItem(item._id)}
                    title="Delete item"
                  >
                    🗑️
                  </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )}
</div>
      </div>
    </div>
  );
}

export default ManageMenu;