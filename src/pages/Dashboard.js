import React, { useEffect, useState } from "react";
import axios from "axios";
import { Film, CheckCircle, Package, Users, Play } from "lucide-react";
import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalMovies: 0,
    activeMovies: 0,
    approvedTheatres: 0,
    totalProducts: 0,
    totalUsers: 0,
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/admin/stats`);
        setStats(res.data);
      } catch (err) {
        console.error("Error loading stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Admin Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card movies">
          <Film size={40} />
          <h3>{stats.totalMovies}</h3>
          <p>Total Movies</p>
        </div>

        <div className="stat-card active-movies">
          <Play size={40} />
          <h3>{stats.activeMovies}</h3>
          <p>Active Movies</p>
        </div>

        <div className="stat-card theatres">
          <CheckCircle size={40} />
          <h3>{stats.approvedTheatres}</h3>
          <p>Approved Theatres</p>
        </div>

        <div className="stat-card products">
          <Package size={40} />
          <h3>{stats.totalProducts}</h3>
          <p>Total Products</p>
        </div>

        <div className="stat-card users">
          <Users size={40} />
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
      </div>
    </div>
  );
}
