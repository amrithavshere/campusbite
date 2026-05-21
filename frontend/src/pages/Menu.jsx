import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Menu() {
  const { canteenId } = useParams();

  const [canteen, setCanteen] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [paymentMode, setPaymentMode] = useState("Cash at Counter");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      setError("");
      const response = await axiosInstance.get(`/menu/canteen/${canteenId}`);
      setCanteen(response.data.canteen);
      setMenuItems(response.data.menuItems);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [canteenId]);

  const handleQuantityChange = (menuItemId, value) => {
    setQuantities({
      ...quantities,
      [menuItemId]: Number(value)
    });
  };

  const addToCart = (item) => {
    const quantity = quantities[item._id] || 1;

    if (quantity < 1) {
      setError("Quantity should be at least 1");
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.menuItem === item._id);

    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.menuItem === item._id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );

      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity
        }
      ]);
    }

    setSuccess(`${item.name} added to cart`);
    setError("");
  };

  const removeFromCart = (menuItemId) => {
    setCart(cart.filter((item) => item.menuItem !== menuItemId));
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const placeOrder = async () => {
    try {
      if (cart.length === 0) {
        setError("Cart is empty");
        return;
      }

      setError("");
      setSuccess("");

      const orderItems = cart.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity
      }));

      const response = await axiosInstance.post("/orders", {
      canteenId,
      items: orderItems,
      paymentMode
    });
      setCart([]);
      setSuccess(response.data.message || "Order placed successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to place order");
    }
  };

  return (
  <div className="container page-container">
    <div className="mb-4">
      <h1 className="section-title mb-1">
        {canteen ? canteen.name : "Menu"}
      </h1>
      <p className="text-soft mb-0">{canteen?.location}</p>
    </div>

    {loading && <p>Loading menu...</p>}

    {error && <div className="alert alert-danger">{error}</div>}

    {success && <div className="alert alert-success">{success}</div>}

    <div className="row">
      <div className="col-lg-8">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Available Items</h4>
          <span className="badge badge-soft px-3 py-2">
            {menuItems.length} items
          </span>
        </div>

        {!loading && menuItems.length === 0 && (
          <div className="alert alert-info">No menu items available.</div>
        )}

        <div className="row">
          {menuItems.map((item) => (
            <div className="col-md-6 mb-4" key={item._id}>
              <div className="card app-card h-100">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-img-top"
                    style={{
                      height: "160px",
                      objectFit: "cover",
                      borderTopLeftRadius: "16px",
                      borderTopRightRadius: "16px"
                    }}
                  />
                )}

                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold mb-1">{item.name}</h5>
                      <p className="text-soft small mb-2">
                        {item.description || "No description added"}
                      </p>
                    </div>

                    <span className="badge bg-secondary">{item.category}</span>
                  </div>

                  <h5 className="fw-bold mt-3 mb-3">₹{item.price}</h5>

                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      style={{ maxWidth: "90px" }}
                      value={quantities[item._id] || 1}
                      onChange={(event) =>
                        handleQuantityChange(item._id, event.target.value)
                      }
                    />

                    <button
                      className="btn btn-orange flex-grow-1 fw-semibold"
                      onClick={() => addToCart(item)}
                    >
                      Add to Bill
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card app-card sticky-top" style={{ top: "90px" }}>
          <div className="card-body p-4">
            <h4 className="fw-bold mb-3">Bill Summary</h4>

            {cart.length === 0 && (
              <p className="text-soft mb-0">
                Add items to view your bill summary.
              </p>
            )}

            {cart.map((item) => (
              <div
                key={item.menuItem}
                className="d-flex justify-content-between align-items-start border-bottom py-3"
              >
                <div>
                  <strong>{item.name}</strong>
                  <div className="small text-soft">
                    ₹{item.price} × {item.quantity}
                  </div>
                </div>

                <div className="text-end">
                  <strong>₹{item.price * item.quantity}</strong>
                  <br />
                  <button
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={() => removeFromCart(item.menuItem)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            {cart.length > 0 && (
              <>
                <div className="mt-3 d-flex justify-content-between fs-5">
                  <strong>Total</strong>
                  <strong>₹{getTotalAmount()}</strong>
                </div>

                <div className="mt-3">
                  <label className="form-label fw-semibold">Payment Mode</label>
                  <select
                    className="form-select"
                    value={paymentMode}
                    onChange={(event) => setPaymentMode(event.target.value)}
                  >
                    <option value="Cash at Counter">Cash at Counter</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>

                {paymentMode === "UPI" && (
                  <div className="alert alert-info mt-3 small mb-0">
                    UPI QR will be shown on your My Orders page after placing
                    the order.
                  </div>
                )}

                <button
                  className="btn btn-success w-100 mt-3 py-2 fw-semibold"
                  onClick={placeOrder}
                >
                  Place Order
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default Menu;