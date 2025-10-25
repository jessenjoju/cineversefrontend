import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminTheatreApproval.css";

export default function AdminTheatreApproval() {
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/theatres/status/pending");
      setTheatres(res.data);
    } catch (err) {
      console.error("Failed to fetch theatres:", err);
      alert("❌ Failed to load pending theatres");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!window.confirm("✅ Approve this theatre?")) return;
    try {
      await axios.put(`http://localhost:5000/api/theatres/approve/${id}`);
      alert("✅ Theatre approved successfully!");
      fetchPending();
    } catch (err) {
      alert("❌ Failed to approve theatre");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("❌ Reject this theatre?")) return;
    try {
      await axios.put(`http://localhost:5000/api/theatres/reject/${id}`);
      alert("🚫 Theatre rejected");
      fetchPending();
    } catch (err) {
      alert("❌ Failed to reject theatre");
    }
  };

  if (loading) return <p className="loading-text">Loading pending theatres...</p>;

  return (
    <div className="theatre-approval-container">
      <h2>🎭 Pending Theatre Approvals</h2>

      {theatres.length === 0 ? (
        <p className="no-theatres-message">No pending theatres</p>
      ) : (
        <table className="theatre-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Owner</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {theatres.map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.ownerName}</td>
                <td>{t.location}</td>
                <td className="action-buttons">
                  <button onClick={() => handleApprove(t._id)} className="approve-btn">
                    ✅ Approve
                  </button>
                  <button onClick={() => handleReject(t._id)} className="reject-btn">
                    ❌ Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
