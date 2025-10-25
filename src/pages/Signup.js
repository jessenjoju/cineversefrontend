import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "./Login.css"; // Using same styles as Login

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      );
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      });
      setSuccess(res.data.message || "Signup successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-page-background">
      

      <div className="login-form-container">
        <h1 className="sign-in-heading">Sign Up</h1>

        {error && <p className="error-message">{error}</p>}
        {success && (
          <p className="error-message" style={{ color: "lightgreen" }}>
            {success}
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <input
            type="email"
            placeholder="Email"
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Google Sign Up Button */}
        <button
          className="google-btn"
          type="button"
          onClick={handleGoogleSignup}
        >
          <FcGoogle size={22} style={{ marginRight: "8px" }} />
          Sign Up with Google
        </button>

        <div className="signup-link">
          <p>
            Already have an account? <a href="/login">Login</a>.
          </p>
        </div>

        <div className="recaptcha-info">
          This page is protected by Google reCAPTCHA. <a href="#">Learn more</a>.
        </div>
      </div>
    </div>
  );
}
