import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function EmployeeDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setError("");
      const response = await axiosInstance.get("/orders/employee");
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

  const updateOrderStatus = async (orderId, status) => {
    try {
      setError("");
      setSuccess("");

      const response = await axiosInstance.put(`/orders/${orderId}/status`, {
        status
      });

      setSuccess(response.data.message);
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update order status");
    }
  };

  const updateBillStatus = async (orderId, billStatus) => {
    try {
      setError("");
      setSuccess("");

      const response = await axiosInstance.put(`/orders/${orderId}/bill-status`, {
        billStatus
      });

      setSuccess(response.data.message);
      fetchOrders();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update bill status");
    }
  };

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
      <h1 className="section-title mb-1">Employee Orders</h1>
      <p className="text-soft mb-0">
        Manage orders, preparation status, and bill payment confirmation.
      </p>
    </div>

    {loading && <p>Loading orders...</p>}

    {error && <div className="alert alert-danger">{error}</div>}

    {success && <div className="alert alert-success">{success}</div>}

    {!loading && orders.length === 0 && (
      <div className="alert alert-info">No orders found.</div>
    )}

    {!loading && orders.length > 0 && (
      <div className="card app-card">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Bill Status</th>
                  <th>Order Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>{order.billNumber || "Not generated"}</strong>
                      <div className="small text-soft">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </td>

                    <td>
                      <strong>{order.customer?.name || "Unknown"}</strong>
                      <div className="small text-soft">
                        {order.customer?.role}
                      </div>
                      <div className="small text-soft">
                        {order.customer?.email}
                      </div>
                    </td>

                    <td style={{ minWidth: "220px" }}>
                      {order.items.map((item) => (
                        <div key={item._id} className="mb-1">
                          <strong>{item.name}</strong>
                          <span className="text-soft small">
                            {" "}
                            ₹{item.price} × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </td>

                    <td>
                      <strong>₹{order.totalAmount}</strong>
                    </td>

                    <td>{order.paymentMode || "Cash at Counter"}</td>

                    <td>
                      <span
                        className={`badge ${getBillStatusBadgeClass(
                          order.billStatus
                        )}`}
                      >
                        {order.billStatus || "Pending"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td style={{ minWidth: "220px" }}>
                      <select
                        className="form-select form-select-sm mb-2"
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(order._id, event.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      {order.billStatus !== "Paid" && (
                        <button
                          className="btn btn-sm btn-success w-100"
                          onClick={() => updateBillStatus(order._id, "Paid")}
                        >
                          Mark Paid
                        </button>
                      )}

                      {order.billStatus === "Paid" && (
                        <button
                          className="btn btn-sm btn-outline-secondary w-100"
                          onClick={() =>
                            updateBillStatus(order._id, "Pending")
                          }
                        >
                          Mark Pending
                        </button>
                      )}
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
);
}

export default EmployeeDashboard;