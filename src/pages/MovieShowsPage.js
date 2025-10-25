import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MovieShowsPage.css";

export default function MovieShowsPage() {
  const { id } = useParams();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    // Fetch movie details
    axios
      .get(`http://localhost:5000/api/movies/${id}`)
      .then((res) => setMovie(res.data))
      .catch((err) => console.error(err));

    // Fetch shows for this movie
    axios
      .get(`http://localhost:5000/api/shows/movie/${id}`)
      .then((res) => setShows(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div className="movie-shows-container">
      <div className="movie-header">
        <img src={movie.posterUrl || "/placeholder.jpg"} alt={movie.title} />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p>{movie.genre} • {movie.language}</p>
          <p>Duration: {movie.duration || "N/A"} | Release: {movie.releaseDate || "N/A"}</p>
        </div>
      </div>

      <h2>Available Shows</h2>
      {shows.length === 0 ? (
        <p>No shows available for this movie.</p>
      ) : (
        <div className="shows-grid">
          {shows.map((show) => (
            <div key={show._id} className="show-card">
              <p><strong>Date:</strong> {show.date}</p>
              <p><strong>Time:</strong> {show.time}</p>
              <p><strong>Screen:</strong> {show.screen}</p>
              <p><strong>Seats Available:</strong> {show.availableSeats || "N/A"}</p>
              <button>Book Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
