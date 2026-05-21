import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "employee") {
      return <Navigate to="/employee/orders" replace />;
    }

    return <Navigate to="/canteens" replace />;
  }

  return children;
}

export default ProtectedRoute;