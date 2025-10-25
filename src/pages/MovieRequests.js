import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MovieRequests.css";

export default function MovieRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Get theatre info from localStorage (you can modify if using login context)
  const theatreData = JSON.parse(localStorage.getItem("theatreData"));
  const theatreId = theatreData?._id;

  // ✅ Fetch movie requests for this theatre
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/requests/theatre/${theatreId}`
        );
        setRequests(res.data);
      } catch (error) {
        console.error("❌ Error fetching movie requests:", error);
      } finally {
        setLoading(false);
      }
    };

    if (theatreId) fetchRequests();
  }, [theatreId]);

  // ✅ Handle Accept / Reject Actions
  const handleAction = async (requestId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/update/${requestId}`, {
        status,
      });

      // Update UI immediately
      setRequests((prev) =>
        prev.map((req) =>
          req._id === requestId ? { ...req, status } : req
        )
      );

      alert(`✅ Request ${status} successfully`);
    } catch (error) {
      console.error("❌ Error updating request:", error);
      alert("Error updating request status");
    }
  };

  if (loading) return <p className="loading">⏳ Loading movie requests...</p>;

  return (
    <div className="movie-requests-container">
      <h2 className="header">🎥 Movie Requests for Your Theatre</h2>

      {requests.length === 0 ? (
        <p className="no-requests">No movie requests yet.</p>
      ) : (
        <div className="requests-list">
          {requests.map((req) => (
            <div key={req._id} className="request-card">
              <div className="movie-info">
                <img
                  src={`http://localhost:5000${req.movie.poster}`}
                  alt={req.movie.title}
                  className="poster"
                />
                <div>
                  <h3>{req.movie.title}</h3>
                  <p><strong>Genre:</strong> {req.movie.genres?.join(", ")}</p>
                  <p><strong>Language:</strong> {req.movie.language}</p>
                  <p><strong>Duration:</strong> {req.movie.duration} mins</p>
                  <p><strong>Release:</strong> {req.movie.releaseDate?.substring(0, 10)}</p>
                </div>
              </div>

              <div className="status-section">
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </p>

                {req.status === "Pending" && (
                  <div className="action-buttons">
                    <button
                      className="accept-btn"
                      onClick={() => handleAction(req._id, "Accepted")}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleAction(req._id, "Rejected")}
                    >
                      ❌ Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
