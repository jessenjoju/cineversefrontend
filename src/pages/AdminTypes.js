import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminTypes.css"; // Import CSS

const API_BASE = "http://localhost:5000/api";

export default function AdminTypes() {
  const [name, setName] = useState("");
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all types
  const fetchTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE}/types`);
      setTypes(res.data);
    } catch (err) {
      setError("Failed to fetch types. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  // Add new type
  const handleAddType = async (e) => {
    e.preventDefault();
    if (name.trim() === "") return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/types`, { name });
      alert("Type added successfully!");
      setName("");
      fetchTypes();
    } catch (err) {
      alert(err.response?.data?.error || "Error adding type");
    } finally {
      setLoading(false);
    }
  };

  // Delete type
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this type?")) return;
    setLoading(true);
    try {
      await axios.put(`${API_BASE}/types/${id}/delete`);
      alert("Type deleted successfully!");
      fetchTypes();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h1 className="admin-title">Admin Dashboard</h1>

        {/* Add Form */}
        <div className="form-section">
          <h2 className="section-title">➕ Add New Product Type</h2>
          <form onSubmit={handleAddType} className="form-inline">
            <input
              type="text"
              value={name}
              placeholder="Enter product type name (3-10 chars)"
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={10}
              className="input-text"
            />
            <button type="submit" disabled={loading} className="btn btn-blue">
              {loading ? "Loading..." : "Add Type"}
            </button>
          </form>
        </div>

        {/* Types Table */}
        <div className="table-section">
          <h2 className="section-title">📋 Existing Product Types</h2>

          {loading && <p className="loading">Loading...</p>}
          {!loading && error && <p className="error">{error}</p>}
          {!loading && !error && types.length === 0 && (
            <p className="no-data">No product types found.</p>
          )}

          {!loading && !error && types.length > 0 && (
            <div className="table-wrapper">
              <table className="styled-table">
                <thead>
                  <tr>
                    <th>SI No.</th>
                    <th>Type Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t, index) => (
                    <tr key={t._id}>
                      <td>{index + 1}</td>
                      <td>{t.name}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="btn btn-red"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
