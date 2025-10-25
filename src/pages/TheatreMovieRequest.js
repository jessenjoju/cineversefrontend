import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TheatreMovieRequests.css"; // optional styling

export default function TheatreMovieRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theatreId, setTheatreId] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const theatreData = localStorage.getItem("theatreData");
    if (theatreData) {
      const parsed = JSON.parse(theatreData);
      setTheatreId(parsed._id);
      fetchRequests(parsed._id);
    }
  }, []);

  const fetchRequests = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/movies/requests/${id}`);
      setRequests(res.data.requests);
    } catch (error) {
      console.error("❌ Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await axios.put(`${API_URL}/api/movies/requests/${requestId}/${action}`);
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status: action } : req
        )
      );
    } catch (error) {
      console.error(`❌ Error updating request:`, error);
      alert("Failed to update request");
    }
  };

  if (loading) return <div className="loading">Loading movie requests...</div>;

  return (
    <div className="theatre-requests">
      <h2>🎬 New Movie Requests</h2>

      {requests.length === 0 ? (
        <p>No movie requests yet.</p>
      ) : (
        requests.map((req) => (
          <div key={req._id} className="request-card">
            <img
              src={`http://localhost:5000${req.movie.poster}`}
              alt={req.movie.title}
              className="poster"
            />
            <div className="info">
              <h3>{req.movie.title}</h3>
              <p>{req.movie.description}</p>
              <p>
                <strong>Language:</strong> {req.movie.language} |{" "}
                <strong>Genres:</strong> {req.movie.genres.join(", ")}
              </p>

              {req.status === "pending" ? (
                <div className="actions">
                  <button
                    className="accept-btn"
                    onClick={() => handleAction(req._id, "accept")}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => handleAction(req._id, "reject")}
                  >
                    ❌ Reject
                  </button>
                </div>
              ) : (
                <p className={`status ${req.status}`}>
                  Status: {req.status.toUpperCase()}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
