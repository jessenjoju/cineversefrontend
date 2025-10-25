import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MovieList.css";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // For button loading state
  const API_URL = "http://localhost:5000/api/movies";

  // =====================
  // Fetch Movies
  // =====================
  const fetchMovies = async () => {
    try {
      const res = await axios.get(API_URL);
      if (res.data && Array.isArray(res.data.movies)) {
        setMovies(res.data.movies);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setMovies([]);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // =====================
  // Toggle Movie Active Status
  // =====================
  const toggleStatus = async (id) => {
    try {
      setLoadingId(id);
      const res = await axios.put(`${API_URL}/${id}/toggle-status`);
      if (res.data.success) {
        setMovies((prev) =>
          prev.map((movie) =>
            movie._id === id ? { ...movie, isActive: res.data.movie.isActive } : movie
          )
        );
      } else {
        alert("❌ Failed to update status");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      alert("❌ Error updating movie status");
    } finally {
      setLoadingId(null);
    }
  };

  // =====================
  // Delete Movie
  // =====================
  const deleteMovie = async (id) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies((prev) => prev.filter((movie) => movie._id !== id));
    } catch (err) {
      console.error("Error deleting movie:", err);
    }
  };

  // =====================
  // Render
  // =====================
  return (
    <div className="movie-list-container">
      <h2 className="page-title">🎬 Movie Collection</h2>

      {movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div className="movie-card" key={movie._id}>
              <div className="movie-image">
                {movie.poster ? (
                  <img
                    src={`http://localhost:5000${movie.poster}`}
                    alt={movie.title}
                  />
                ) : (
                  <div className="no-image">No Poster</div>
                )}
              </div>

              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p>
                  <strong>Release:</strong>{" "}
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Genre:</strong>{" "}
                  {movie.genres?.length ? movie.genres.join(", ") : "Not specified"}
                </p>
                <p>
                  <strong>Language:</strong> {movie.language || "Unknown"}
                </p>

                <div className="status-row">
                  <span
                    className={`status-dot ${
                      movie.isActive ? "active" : "inactive"
                    }`}
                  ></span>
                  {movie.isActive ? "Active" : "Inactive"}
                </div>

                <div className="movie-buttons">
                  <button
                    className={movie.isActive ? "btn-deactivate" : "btn-activate"}
                    onClick={() => toggleStatus(movie._id)}
                    disabled={loadingId === movie._id}
                  >
                    {loadingId === movie._id
                      ? "Updating..."
                      : movie.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => deleteMovie(movie._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-movies">No movies available.</p>
      )}
    </div>
  );
}
