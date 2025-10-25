// src/ForgotPassword.js
import React, { useState } from "react";
import axios from "axios";
import "./ResetPassword.css"; // Reuse same styles

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setMessage("");
        setError("");
        try {
            const res = await axios.post("http://localhost:5000/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-form-card">
                <h2 className="form-title">Forgot Password</h2>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <button className="reset-btn" onClick={handleSubmit}>
                    Send Reset Link
                </button>

                {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            </div>
        </div>
    );
}
