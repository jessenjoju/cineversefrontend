import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function RegisterTheatre() {
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    ownerName: "",
    address: "",
    pincode: "",
    location: "",
    workingTime: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  // Fetch theatre details
  useEffect(() => {
    const fetchTheatre = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/theatres/${id}`);
        setForm((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
        }));
      } catch (err) {
        console.error("Failed to fetch theatre:", err);
        if (err.response?.status === 403) {
          setExpired(true);
        } else {
          alert("❌ Failed to load theatre data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTheatre();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/theatres/update/${id}`, form);
      alert("✅ Registration Completed Successfully!");
      setTimeout(() => {
        window.close();
      }, 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        alert("⚠️ This registration link has expired or already used.");
        setExpired(true);
      } else {
        alert("❌ Failed to submit registration");
      }
    }
  };

  if (loading)
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.loader}></div>
        <p style={{ marginTop: "15px", color: "#555" }}>Loading theatre data...</p>
      </div>
    );

  if (expired) {
    return (
      <div style={styles.expiredContainer}>
        <h2 style={{ color: "#d9534f" }}>⚠️ Registration Link Expired</h2>
        <p style={{ color: "#555" }}>
          This registration link has already been used or expired. <br />
          Please contact <strong>MovieHub Admin</strong> for a new invitation.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>🎬 Register Your Theatre</h2>
        <p style={styles.subtitle}>Complete your theatre registration below</p>

        {[
          { label: "Theatre Name", name: "name", readOnly: true },
          { label: "Email", name: "email", type: "email", readOnly: true },
          { label: "Owner Name", name: "ownerName" },
          { label: "Address", name: "address" },
          { label: "Pincode", name: "pincode" },
          { label: "Location", name: "location" },
          { label: "Working Time", name: "workingTime", placeholder: "e.g., 9 AM - 10 PM" },
          { label: "Username", name: "username" },
          { label: "Password", name: "password", type: "password" },
        ].map((field) => (
          <div key={field.name} style={styles.inputGroup}>
            <label style={styles.label}>{field.label}</label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || ""}
              required={!field.readOnly}
              readOnly={field.readOnly}
              style={{
                ...styles.input,
                backgroundColor: field.readOnly ? "#f3f3f3" : "#fff",
                cursor: field.readOnly ? "not-allowed" : "text",
              }}
            />
          </div>
        ))}

        <button type="submit" style={styles.button}>
          Submit Registration
        </button>
      </form>
    </div>
  );
}

/* ============================
   💅 Inline Styling Section
============================ */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1c1f26, #2b303a)",
    fontFamily: "Poppins, sans-serif",
  },
  form: {
    width: "100%",
    maxWidth: "520px",
    background: "#fff",
    padding: "35px 40px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "5px",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "#777",
    marginBottom: "25px",
    fontSize: "0.95rem",
  },
  inputGroup: {
    marginBottom: "18px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "600",
    marginBottom: "6px",
    color: "#333",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "0.95rem",
    transition: "all 0.2s ease",
  },
  button: {
    background: "#007bff",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    fontSize: "1rem",
    fontWeight: "600",
    marginTop: "8px",
    transition: "all 0.3s ease",
  },
  loaderContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  loader: {
    width: "40px",
    height: "40px",
    border: "5px solid #ccc",
    borderTop: "5px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  expiredContainer: {
    textAlign: "center",
    marginTop: "150px",
    fontFamily: "Poppins, sans-serif",
  },
};

// Inject CSS keyframes manually
const styleSheet = document.createElement("style");
styleSheet.innerHTML = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}`;
document.head.appendChild(styleSheet);
