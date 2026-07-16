import { useEffect,useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Canteens from "./pages/Canteens";
import Menu from "./pages/Menu";
import MyOrders from "./pages/MyOrders";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManageMenu from "./pages/ManageMenu";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminEmployees from "./pages/AdminEmployees";

function App() {
  const [notification, setNotification] = useState(null);
  useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) return;

  const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

  socket.emit("joinUserRoom", user.id);

  socket.on("orderReady", (data) => {
    setNotification({
      message: data.message,
      orderId: data.orderId
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  });

  return () => {
    socket.disconnect();
  };
  }, []);
  return (
    <BrowserRouter>
      <Navbar />
      {notification && (
        <div
          className="position-fixed top-0 end-0 m-4 alert alert-success shadow"
          style={{ zIndex: 9999, minWidth: "300px", borderRadius: "14px" }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>Order Ready!</strong>
              <div>{notification.message}</div>
            </div>

            <button
              className="btn-close ms-3"
              onClick={() => setNotification(null)}
            ></button>
          </div>
        </div>
      )}
      <Routes>
  <Route path="/" element={<Navigate to="/login" />} />

  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route
    path="/canteens"
    element={
      <ProtectedRoute allowedRoles={["student", "staff"]}>
        <Canteens />
      </ProtectedRoute>
    }
  />

  <Route
    path="/menu/:canteenId"
    element={
      <ProtectedRoute allowedRoles={["student", "staff"]}>
        <Menu />
      </ProtectedRoute>
    }
  />

  <Route
    path="/my-orders"
    element={
      <ProtectedRoute allowedRoles={["student", "staff"]}>
        <MyOrders />
      </ProtectedRoute>
    }
  />

    <Route
      path="/employee/orders"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <EmployeeDashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/employee/menu"
      element={
        <ProtectedRoute allowedRoles={["employee"]}>
          <ManageMenu />
        </ProtectedRoute>
      }
    />

    <Route
    path="/admin/employees"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminEmployees />
      </ProtectedRoute>
    }
  />
      </Routes>
    </BrowserRouter>
  );
}

export default App;