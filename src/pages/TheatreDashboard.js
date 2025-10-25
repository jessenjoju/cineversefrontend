import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  FaChartBar,
  FaFilm,
  FaDoorOpen,
  FaTheaterMasks,
  FaUserCircle,
  FaBell,
  FaClipboardList,
} from "react-icons/fa";
import "./TheatreDashboard.css";

export default function TheatreDashboard() {
  const [theatre, setTheatre] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [movies, setMovies] = useState([]);
  const [movieRequests, setMovieRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // ✅ Fetch movies + requests
  const fetchDashboardData = useCallback(async (theatreId) => {
    setLoading(true);
    try {
      console.log("🎬 Fetching movies and requests for theatre:", theatreId);

      const [moviesRes, requestsRes] = await Promise.all([
        axios.get(`${API_URL}/api/movies/active`).catch(() => ({ data: [] })),
        axios
          .get(`${API_URL}/api/movies/requests/${theatreId}`)
          .catch(() => ({ data: { requests: [] } })),
      ]);

      const moviesData = Array.isArray(moviesRes.data) ? moviesRes.data : [];
      const requestsData = Array.isArray(requestsRes.data.requests)
        ? requestsRes.data.requests
        : [];

      setMovies(moviesData);
      setMovieRequests(requestsData);

      // 🔔 Extract pending requests for notifications
      const pending = requestsData.filter((r) => r.status === "pending");
      setNotifications(pending);
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  // ✅ Fetch notifications
  const fetchNotifications = useCallback(async (theatreId) => {
    try {
      console.log("🔁 Fetching latest notifications...");
      const res = await axios.get(`${API_URL}/api/movies/requests/${theatreId}`);
      const requestsData = Array.isArray(res.data.requests)
        ? res.data.requests
        : [];
      const pending = requestsData.filter((r) => r.status === "pending");
      setNotifications(pending);
      setMovieRequests(requestsData);
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  }, [API_URL]);

  // ✅ Load theatre data and normalize ID
  useEffect(() => {
    const stored = localStorage.getItem("theatreData");
    if (!stored) {
      console.warn("⚠️ No theatre data found in localStorage");
      setLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (parsed && (parsed._id || parsed.id)) {
        const theatreId = parsed._id || parsed.id;
        const normalized = { ...parsed, id: theatreId }; // normalize ID
        setTheatre(normalized);
        fetchDashboardData(theatreId);
      } else {
        console.error("❌ Invalid theatre data:", parsed);
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Error parsing theatreData:", err);
      setLoading(false);
    }
  }, [fetchDashboardData]);

  // ✅ Refetch notifications when tab changes
  useEffect(() => {
    if (activeTab === "notifications" && theatre) {
      fetchNotifications(theatre.id);
    }
  }, [activeTab, theatre, fetchNotifications]);

  // ✅ Accept / Reject movie
  const handleDecision = async (movieId, action) => {
    try {
      const existing = movieRequests.find((r) => r.movie?._id === movieId);
      if (!existing) return;

      const res = await axios.put(
        `${API_URL}/api/movies/requests/${existing._id}/${action}`
      );

      if (res.data.success) {
        setMovieRequests((prev) =>
          prev.map((req) =>
            req._id === existing._id
              ? { ...req, status: action === "accept" ? "accepted" : "rejected" }
              : req
          )
        );
        setNotifications((prev) =>
          prev.filter((n) => n.movie._id !== movieId)
        );
      }
    } catch (err) {
      console.error("❌ Error updating request:", err);
    }
  };

  const getStatusForMovie = (movieId) => {
    const req = movieRequests.find((r) => r.movie?._id === movieId);
    return req ? req.status : "pending";
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/theatre-login";
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <h2>Loading Theatre Dashboard...</h2>
      </div>
    );
  }

  if (!theatre) {
    return (
      <div className="loading-screen text-center">
        <h2>No theatre data found. Please log in again.</h2>
        <button
          onClick={() => (window.location.href = "/theatre-login")}
          className="btn btn-primary mt-3"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="theatre-dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar-modern">
        <div className="sidebar-header">
          <FaTheaterMasks className="sidebar-logo" />
          <h3>THEATRE HUB</h3>
        </div>

        <ul className="sidebar-menu-modern">
          <li
            className={activeTab === "dashboard" ? "active" : ""}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartBar className="menu-icon" />
            <span>Dashboard</span>
          </li>

          <li
            className={activeTab === "movies" ? "active" : ""}
            onClick={() => setActiveTab("movies")}
          >
            <FaFilm className="menu-icon" />
            <span>Movies</span>
          </li>

          <li
            className={activeTab === "requests" ? "active" : ""}
            onClick={() => setActiveTab("requests")}
          >
            <FaClipboardList className="menu-icon" />
            <span>Movie Requests</span>
          </li>

          <li
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            <FaBell className="menu-icon" />
            <span>Notifications</span>
            {notifications.length > 0 && (
              <span className="badge">{notifications.length}</span>
            )}
          </li>

          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <FaUserCircle className="menu-icon" />
            <span>Profile</span>
          </li>

          <li className="logout-btn-modern" onClick={handleLogout}>
            <FaDoorOpen className="menu-icon" />
            <span>Logout</span>
          </li>
        </ul>
      </aside>

      {/* Main Area */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h2>{theatre.name}</h2>
            <p>{theatre.email}</p>
            <p className="text-muted">{theatre.location || "Unknown location"}</p>
          </div>
        </header>

        <section className="dashboard-content">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="dashboard-cards">
              <div className="card">
                <h5>Status</h5>
                <p className="fw-bold text-success">Approved ✅</p>
              </div>

              <div className="card">
                <h5>Total Active Movies</h5>
                <p>{movies.length}</p>
              </div>

              <div className="card">
                <h5>Accepted Movies</h5>
                <p>
                  {movieRequests.filter((r) => r.status === "accepted").length}
                </p>
              </div>
            </div>
          )}

          {/* Active Movies */}
          {activeTab === "movies" && (
            <div className="movie-section">
              <h4>Active Movies</h4>
              {movies.length > 0 ? (
                <div className="movies-grid">
                  {movies.map((movie) => {
                    const status = getStatusForMovie(movie._id);
                    return (
                      <div key={movie._id} className="movie-card">
                        <img
                          src={
                            movie.poster
                              ? `${API_URL}${movie.poster}`
                              : "/no-image.png"
                          }
                          alt={movie.title}
                        />
                        <div className="movie-info">
                          <h5>{movie.title}</h5>
                          <p className="text-muted">
                            {movie.language} | {movie.certification}
                          </p>
                          <p>
                            Status:{" "}
                            <span className={`status ${status}`}>{status}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p>No active movies found.</p>
              )}
            </div>
          )}

          {/* Movie Requests */}
          {activeTab === "requests" && (
            <div className="movie-requests-tab">
              <h4>🎥 Movie Requests Sent by Admin</h4>
              {movieRequests.length > 0 ? (
                <div className="requests-list">
                  {movieRequests.map((req) => (
                    <div key={req._id} className="request-card">
                      <img
                        src={
                          req.movie?.poster
                            ? `${API_URL}${req.movie.poster}`
                            : "/no-image.png"
                        }
                        alt={req.movie?.title}
                      />
                      <div className="request-info">
                        <h5>{req.movie?.title}</h5>
                        <p>
                          {req.movie?.language} | {req.movie?.certification}
                        </p>
                        <p>
                          Status:{" "}
                          <span className={`status ${req.status}`}>
                            {req.status}
                          </span>
                        </p>

                        {req.status === "pending" && (
                          <div className="movie-actions">
                            <button
                              className="accept"
                              onClick={() =>
                                handleDecision(req.movie._id, "accept")
                              }
                            >
                              ✅ Accept
                            </button>
                            <button
                              className="reject"
                              onClick={() =>
                                handleDecision(req.movie._id, "reject")
                              }
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No movie requests found.</p>
              )}
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="notifications-tab">
              <h4>📢 New Movie Notifications</h4>
              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map((req) => (
                    <div key={req._id} className="notification-card">
                      <strong>{req.movie?.title}</strong>
                      <p>
                        Language: {req.movie?.language} |{" "}
                        {req.movie?.certification}
                      </p>
                      <div className="movie-actions">
                        <button
                          className="accept"
                          onClick={() =>
                            handleDecision(req.movie._id, "accept")
                          }
                        >
                          ✅ Accept
                        </button>
                        <button
                          className="reject"
                          onClick={() =>
                            handleDecision(req.movie._id, "reject")
                          }
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No new movie notifications 🎬</p>
              )}
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="profile-tab">
              <h4>Profile Information</h4>
              <p>
                <strong>Name:</strong> {theatre.name}
              </p>
              <p>
                <strong>Email:</strong> {theatre.email}
              </p>
              <p>
                <strong>Location:</strong> {theatre.location || "Unknown"}
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
