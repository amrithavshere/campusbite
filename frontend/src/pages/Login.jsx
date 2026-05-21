import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setLoading(true);

      const response = await axiosInstance.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "employee") {
              navigate("/employee/orders");
            } else if (response.data.user.role === "admin") {
              navigate("/admin/employees");
            } else {
              navigate("/canteens");
            }

            window.location.reload();          
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="container page-container">
    <div className="row justify-content-center align-items-center">
      <div className="col-md-6 col-lg-5">
        <div className="text-center mb-4">
          <h1 className="section-title">Welcome Back</h1>
          <p className="text-soft">
            Login to order from your college canteen.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="card app-card p-4">
          <h4 className="mb-3">Login</h4>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </div>

          <button className="btn btn-orange w-100 py-2 fw-semibold" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-3 text-center mb-0">
            New user? <Link to="/register">Register here</Link>
          </p>
        </form>

        <div className="card app-card p-3 mt-4">
          <p className="fw-semibold mb-2">Test employee login</p>
          <p className="small text-soft mb-1">maincanteen@example.com / 123456</p>
          <p className="small text-soft mb-0">minicanteen@example.com / 123456</p>
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;