import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark primary-gradient shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to={token ? (user?.role === "employee" ? "/employee/orders" : "/canteens") : "/login"}>
          CampusBite
        </Link>

        <div className="d-flex gap-3 align-items-center">
          {!token && (
            <>
              <Link className="nav-link text-white fw-semibold" to="/login">
                Login
              </Link>
              <Link className="nav-link text-white fw-semibold" to="/register">
                Register
              </Link>
            </>
          )}

          {token && user?.role !== "employee" && (
            <>
              <Link className="nav-link text-white fw-semibold" to="/canteens">
                Canteens
              </Link>
              <Link className="nav-link text-white fw-semibold" to="/my-orders">
                My Orders
              </Link>
            </>
          )}

          {token && user?.role === "employee" && (
              <>
                <Link className="nav-link text-white fw-semibold" to="/employee/orders">
                  Orders
                </Link>
                <Link className="nav-link text-white fw-semibold" to="/employee/menu">
                  Manage Menu
                </Link>
              </>
            )}

          {token && user?.role === "admin" && (
            <>
              <Link className="nav-link text-white fw-semibold" to="/admin/employees">
                Employees
              </Link>
            </>
          )}

          {token && (
            <>
              <span className="badge bg-light text-dark d-none d-md-inline">
                {user?.role}
              </span>

              <button className="btn btn-sm btn-light fw-semibold" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;