import React, { useState } from "react";
import axios from "axios";
import "./AddTheatre.css";

export default function AddTheatre() {
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // success / error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage({ text: "", type: "" }); // Clear messages when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/theatres/add", form);

      setMessage({ text: res.data.message || "✅ Theatre Added & Email Sent!", type: "success" });
      setForm({ name: "", email: "" });
    } catch (err) {
      console.error(err);

      const errorMsg =
        err.response?.data?.error ||
        "❌ Failed to add theatre. Please try again.";

      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-theatre-container">
      <form className="add-theatre-form" onSubmit={handleSubmit}>
        <h2 className="add-theatre-header">🎬 Add New Theatre</h2>

        {message.text && (
          <div
            className={`message-box ${
              message.type === "success" ? "success" : "error"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="input-group">
          <label htmlFor="name">Theatre Name</label>
          <input
            id="name"
            name="name"
            placeholder="Enter theatre name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Owner Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter owner email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "⏳ Adding..." : "Add Theatre"}
        </button>
      </form>
    </div>
  );
}
