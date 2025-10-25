// src/ResetPassword.js
import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ResetPassword.css"; // Import the style

export default function ResetPassword() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("id");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:5000/reset-password/${token}?id=${userId}`,
                { password }
            );
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-form-card">
                <h2 className="form-title">Reset Password</h2>

                <input
                    type="password"
                    placeholder="New password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />

                <button className="reset-btn" onClick={handleSubmit}>
                    Reset Password
                </button>

                {message && <p style={{ color: "green", marginTop: "10px" }}>{message}</p>}
                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            </div>
        </div>
    );
}
