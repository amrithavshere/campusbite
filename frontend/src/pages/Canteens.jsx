import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function Canteens() {
  const navigate = useNavigate();

  const [canteens, setCanteens] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCanteens = async () => {
    try {
      setError("");
      const response = await axiosInstance.get("/canteens");
      setCanteens(response.data.canteens);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch canteens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanteens();
  }, []);

  const handleChooseCanteen = (canteenId) => {
    navigate(`/menu/${canteenId}`);
  };

  return (
  <div className="container page-container">
    <div className="text-center mb-4">
      <h1 className="section-title">Choose Your Canteen</h1>
      <p className="text-soft">
        Select a canteen to view available food items and place your order.
      </p>
    </div>

    {loading && <p className="text-center">Loading canteens...</p>}

    {error && <div className="alert alert-danger">{error}</div>}

    {!loading && canteens.length === 0 && (
      <div className="alert alert-info text-center">No canteens available.</div>
    )}

    <div className="row justify-content-center">
      {canteens.map((canteen) => (
        <div className="col-md-6 col-lg-5 mb-4" key={canteen._id}>
          <div className="card app-card h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="fw-bold mb-1">{canteen.name}</h4>
                  <p className="text-soft mb-0">
                    {canteen.location || "Location not added"}
                  </p>
                </div>

                <span className="badge badge-soft px-3 py-2">
                  Open
                </span>
              </div>

              <p className="text-soft">
                Browse the menu, add your favorite items to the bill summary,
                and place your order easily.
              </p>

              <button
                className="btn btn-orange w-100 py-2 fw-semibold"
                onClick={() => handleChooseCanteen(canteen._id)}
              >
                View Menu
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default Canteens;