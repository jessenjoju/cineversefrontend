import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Film,
  Theater,
  Package,
  Boxes,
  ListOrdered,
  LogOut,
  List,
  CheckSquare,
  BadgeCheck, // ✅ For approved theatres icon
} from "lucide-react";
import "./AdminPage.css";

// Import admin subcomponents
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import AddMovie from "./AddMovie";
import MovieList from "./MovieList";
import AddTheatre from "./AddTheatre";
import AddShow from "./AddShow";
import AdminProducts from "./AdminProducts";
import AdminTypes from "./AdminTypes";
import ProductList from "./ProductList";
import AdminTheatreApproval from "./AdminTheatreApproval"; // ✅ Pending theatres
import ApprovedTheatres from "./ApprovedTheatres"; // ✅ Approved theatres list

export default function AdminPage() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Dynamic content rendering
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "profile":
        return <Profile />;
      case "add-movies":
        return <AddMovie />;
      case "list-movies":
        return <MovieList />;
      case "add-theatre":
        return <AddTheatre />;
      case "approve-theatre":
        return <AdminTheatreApproval />;
      case "approved-theatres":
        return <ApprovedTheatres />; // ✅ Added this
      case "add-show":
        return <AddShow />;
      case "add-products":
        return <AdminProducts />;
      case "add-types":
        return <AdminTypes />;
      case "list-products":
        return <ProductList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          🎬 <h2>MovieHub Admin</h2>
        </div>

        <ul className="sidebar-menu">
          <li
            className={activePage === "dashboard" ? "active" : ""}
            onClick={() => setActivePage("dashboard")}
          >
            <LayoutDashboard size={18} /> Dashboard
          </li>

          <li
            className={activePage === "profile" ? "active" : ""}
            onClick={() => setActivePage("profile")}
          >
            <User size={18} /> Profile
          </li>

          <li
            className={activePage === "add-movies" ? "active" : ""}
            onClick={() => setActivePage("add-movies")}
          >
            <Film size={18} /> Add Movies
          </li>

          <li
            className={activePage === "list-movies" ? "active" : ""}
            onClick={() => setActivePage("list-movies")}
          >
            <List size={18} /> View Movies
          </li>

          <li
            className={activePage === "add-theatre" ? "active" : ""}
            onClick={() => setActivePage("add-theatre")}
          >
            <Theater size={18} /> Add Theatres
          </li>

          {/* ✅ Pending Theatre Approvals */}
          <li
            className={activePage === "approve-theatre" ? "active" : ""}
            onClick={() => setActivePage("approve-theatre")}
          >
            <CheckSquare size={18} /> Approve Theatres
          </li>

          {/* ✅ Approved Theatres List */}
          <li
            className={activePage === "approved-theatres" ? "active" : ""}
            onClick={() => setActivePage("approved-theatres")}
          >
            <BadgeCheck size={18} /> Approved Theatres
          </li>

          <li
            className={activePage === "add-types" ? "active" : ""}
            onClick={() => setActivePage("add-types")}
          >
            <Boxes size={18} /> Manage Product Types
          </li>

          <li
            className={activePage === "add-products" ? "active" : ""}
            onClick={() => setActivePage("add-products")}
          >
            <Package size={18} /> Manage Products
          </li>

          <li
            className={activePage === "list-products" ? "active" : ""}
            onClick={() => setActivePage("list-products")}
          >
            <ListOrdered size={18} /> List Products
          </li>

          <li className="logout" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <section className="content-section">{renderContent()}</section>
      </main>
    </div>
  );
}
