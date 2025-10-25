import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // 👈 Default: user login
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;

      // 🎭 Theatre login uses a different endpoint
      if (role === "theatre") {
        res = await axios.post(`${API_URL}/api/auth/theatre-login`, {
          email,
          password,
        });
        localStorage.setItem("theatreToken", res.data.token);
        localStorage.setItem("theatreData", JSON.stringify(res.data.theatre));
        navigate("/theatre-dashboard");
      } else {
        // 👤 Admin/User login
        res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
        localStorage.setItem("token", res.data.token);

        if (res.data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="login-page-background">
      <div className="login-form-container">
        <h1 className="sign-in-heading">Sign In</h1>

        {error && <p className="error-message">{error}</p>}

        {/* 👇 Role Selection Dropdown */}
        <div className="mb-3 text-center">
          <label htmlFor="role" className="form-label fw-bold">
            Select Role
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-select"
            style={{
              width: "100%",
              marginBottom: "15px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="theatre">Theatre Owner</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email or phone number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Google Sign In */}
        {role === "user" && (
          <button className="google-btn" type="button" onClick={handleGoogleLogin}>
            <FcGoogle size={22} style={{ marginRight: "8px" }} />
            Sign In with Google
          </button>
        )}

        <div className="signup-link">
          {role === "user" && (
            <p>
              New to Cineverse? <a href="/signup">Sign up now</a>.
            </p>
          )}
        </div>

        <div className="recaptcha-info">
          This page is protected by Google reCAPTCHA to ensure you're not a bot.{" "}
          <a href="#">Learn more</a>.
        </div>
      </div>
    </div>
  );
}
