import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import TheatreDashboard from "./pages/TheatreDashboard";


// New imports
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthRedirect from "./pages/AuthRedirect";
import MovieShowsPage from "./pages/MovieShowsPage";

// ✅ New import for theatre registration
import RegisterTheatre from "./pages/RegisterTheatre";

function AppLayout() {
  const location = useLocation();
  const hideHeaderRoutes = ["/user", "/admin"]; // ✅ Simplified to just /admin

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User/Admin */}
        <Route path="/user" element={<UserPage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* ✅ The single route for all admin pages */}

        {/* Auth routes */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth-redirect" element={<AuthRedirect />} />
        <Route path="/theatre-dashboard" element={<TheatreDashboard />} />

        {/* Movie route */}
        <Route path="/movies/:id" element={<MovieShowsPage />} />

        {/* ✅ Theatre owner registration route */}
        <Route path="/register-theatre/:id" element={<RegisterTheatre />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}