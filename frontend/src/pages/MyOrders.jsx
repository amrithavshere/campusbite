import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await axiosInstance.get("/orders/my-orders");
      setOrders(response.data.orders);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadgeClass = (status) => {
    if (status === "Ready") return "bg-success";
    if (status === "Preparing") return "bg-warning text-dark";
    if (status === "Completed") return "bg-primary";
    if (status === "Cancelled") return "bg-danger";
    return "bg-secondary";
  };

  const getBillStatusBadgeClass = (status) => {
    if (status === "Paid") return "bg-success";
    return "bg-warning text-dark";
  };

  return (
  <div className="container page-container">
    <div className="mb-4">
      <h1 className="section-title mb-1">My Orders</h1>
      <p className="text-soft mb-0">
        Track your orders, bill status, and payment details.
      </p>
    </div>

    {loading && <p>Loading orders...</p>}

    {error && <div className="alert alert-danger">{error}</div>}

    {!loading && orders.length === 0 && (
      <div className="alert alert-info">You have not placed any orders yet.</div>
    )}

    <div className="row">
      {orders.map((order) => (
        <div className="col-lg-6 mb-4" key={order._id}>
          <div className="card app-card h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="fw-bold mb-1">
                    {order.canteen?.name || "Canteen"}
                  </h5>

                  <p className="text-soft small mb-1">
                    Bill No:{" "}
                    <strong className="text-dark">
                      {order.billNumber || "Not generated"}
                    </strong>
                  </p>

                  <p className="text-soft small mb-0">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-end">
                  <span className={`badge ${getStatusBadgeClass(order.status)} mb-2`}>
                    {order.status}
                  </span>
                  <br />
                  <span className={`badge ${getBillStatusBadgeClass(order.billStatus)}`}>
                    Bill: {order.billStatus || "Pending"}
                  </span>
                </div>
              </div>

              <div className="border rounded p-3 bg-light">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between border-bottom py-2"
                  >
                    <div>
                      <strong>{item.name}</strong>
                      <div className="small text-soft">
                        ₹{item.price} × {item.quantity}
                      </div>
                    </div>

                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}

                <div className="mt-3 d-flex justify-content-between fs-5">
                  <strong>Total</strong>
                  <strong>₹{order.totalAmount}</strong>
                </div>
              </div>

              <div className="mt-3 d-flex justify-content-between">
                <span className="text-soft">Payment Mode</span>
                <strong>{order.paymentMode || "Cash at Counter"}</strong>
              </div>

              {order.paymentMode === "UPI" && order.billStatus !== "Paid" && (
                <div className="mt-3 p-3 border rounded bg-white text-center">
                  <h6 className="fw-bold">UPI Payment</h6>

                  <p className="mb-1">
                    Scan and pay to <strong>{order.canteen?.name}</strong>
                  </p>

                  <p className="mb-1">
                    UPI ID:{" "}
                    <strong>{order.canteen?.upiId || "Not available"}</strong>
                  </p>

                  <p className="mb-2">
                    Amount: <strong>₹{order.totalAmount}</strong>
                  </p>

                  {order.canteen?.upiQrImage ? (
                    <img
                      src={order.canteen.upiQrImage}
                      alt="UPI QR Code"
                      style={{ width: "180px", height: "180px" }}
                      className="border rounded p-1 bg-white"
                    />
                  ) : (
                    <p className="text-soft">QR code not available.</p>
                  )}

                  <p className="small text-soft mt-2 mb-0">
                    After payment, show the payment confirmation at the canteen
                    counter.
                  </p>
                </div>
              )}

              {order.billStatus === "Paid" && (
                <div className="alert alert-success mt-3 mb-0">
                  Payment verified by canteen.
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default MyOrders;