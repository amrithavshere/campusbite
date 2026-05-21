import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [canteens, setCanteens] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    canteenId: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setError("");

      const [employeesResponse, canteensResponse] = await Promise.all([
        axiosInstance.get("/admin/employees"),
        axiosInstance.get("/canteens")
      ]);

      setEmployees(employeesResponse.data.employees);
      setCanteens(canteensResponse.data.canteens);

      if (
        canteensResponse.data.canteens.length > 0 &&
        !formData.canteenId
      ) {
        setFormData((prev) => ({
          ...prev,
          canteenId: canteensResponse.data.canteens[0]._id
        }));
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setSuccess("");

      await axiosInstance.post("/admin/employees", formData);

      setSuccess("Employee created successfully");

      setFormData({
        name: "",
        email: "",
        password: "",
        canteenId: canteens[0]?._id || ""
      });

      fetchData();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create employee");
    }
  };

  const deleteEmployee = async (employeeId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this employee?"
  );

  if (!confirmDelete) return;

  try {
    setError("");
    setSuccess("");

    await axiosInstance.delete(`/admin/employees/${employeeId}`);

    setSuccess("Employee deleted successfully");
    fetchData();
  } catch (error) {
    setError(error.response?.data?.message || "Failed to delete employee");
  }
};

  return (
    <div className="container page-container">
      <div className="mb-4">
        <h1 className="section-title mb-1">Manage Employees</h1>
        <p className="text-soft mb-0">
          Create canteen employee accounts and assign them to a canteen.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {success && <div className="alert alert-success">{success}</div>}

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card app-card">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Create Employee</h4>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Employee name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="employee@example.com"
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
                    placeholder="Temporary password"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Assign Canteen</label>
                  <select
                    name="canteenId"
                    className="form-select"
                    value={formData.canteenId}
                    onChange={handleChange}
                    required
                  >
                    {canteens.map((canteen) => (
                      <option key={canteen._id} value={canteen._id}>
                        {canteen.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="btn btn-orange w-100 fw-semibold">
                  Create Employee
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <h4 className="fw-bold mb-3">Employee List</h4>

          {loading && <p>Loading employees...</p>}

          {!loading && employees.length === 0 && (
            <div className="alert alert-info">No employees found.</div>
          )}

          {!loading && employees.length > 0 && (
            <div className="card app-card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Canteen</th>
                        <th>Created</th>
                        <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee._id}>
                          <td>
                            <strong>{employee.name}</strong>
                          </td>

                          <td>{employee.email}</td>

                          <td>
                            <span className="badge badge-soft px-3 py-2">
                              {employee.canteen?.name || "Not assigned"}
                            </span>
                          </td>

                          <td className="small text-soft">
                            {new Date(employee.createdAt).toLocaleString()}
                          </td>
                          <td>
                            <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteEmployee(employee._id)}
                                title="Delete employee">
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

export default AdminEmployees;