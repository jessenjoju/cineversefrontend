import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AuthRedirect() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      console.log("Token received:", token);
      localStorage.setItem("authToken", token); // ✅ use same key as UserPage
      navigate("/user"); // or "/admin" depending on role
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <p>Redirecting...</p>;
}
