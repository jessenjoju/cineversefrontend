// ✅ src/pages/UserPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserPage.css";

export default function UserPage() {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all active movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_URL}/movies/active`);
        setMovies(res.data);
      } catch (err) {
        console.error("❌ Error fetching movies:", err);
        alert("Failed to load movies");
      }
    };
    fetchMovies();
  }, [API_URL]);

  // ✅ When a movie is selected, load its screens
  const handleMovieSelect = async (movie) => {
    setSelectedMovie(movie);
    setSelectedScreen(null);
    setSelectedShow(null);
    setSeatLayout([]);
    setSelectedSeats([]);
    setTotalPrice(0);

    try {
      const res = await axios.get(`${API_URL}/movies/${movie._id}/screens`);
      setScreens(res.data);
    } catch (err) {
      console.error("❌ Error fetching screens:", err);
      alert("Failed to load screens for this movie");
    }
  };

  // ✅ When a screen is selected, load its shows
  const handleScreenSelect = async (screen) => {
    setSelectedScreen(screen);
    setSelectedShow(null);
    setSeatLayout([]);
    setSelectedSeats([]);
    setTotalPrice(0);

    try {
      const res = await axios.get(`${API_URL}/screens/${screen._id}/shows`);
      setShows(res.data);
    } catch (err) {
      console.error("❌ Error fetching shows:", err);
      alert("Failed to load shows for this screen");
    }
  };

  // ✅ When a show is selected, load seat layout
  const handleShowSelect = async (show) => {
    setSelectedShow(show);
    setSelectedSeats([]);
    setTotalPrice(0);
    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/shows/${show._id}/seats`);
      setSeatLayout(res.data.layout);
    } catch (err) {
      console.error("❌ Error fetching seat layout:", err);
      alert("Failed to load seat layout");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle seat selection
  const toggleSeat = (rowIndex, colIndex) => {
    const seatId = `${rowIndex}-${colIndex}`;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // ✅ Calculate total price based on selected seats
  useEffect(() => {
    let price = 0;
    selectedSeats.forEach((seatId) => {
      const [r, c] = seatId.split("-").map(Number);
      const row = seatLayout[r];
      if (row && row[c]) {
        price += row[c].price || 0;
      }
    });
    setTotalPrice(price);
  }, [selectedSeats, seatLayout]);

  // ✅ Handle booking
  const handleBookNow = async () => {
    if (!selectedMovie || !selectedScreen || !selectedShow || selectedSeats.length === 0) {
      alert("Please select movie, screen, showtime, and seats!");
      return;
    }

    try {
      const bookingData = {
        movieId: selectedMovie._id,
        screenId: selectedScreen._id,
        showId: selectedShow._id,
        seats: selectedSeats,
        totalPrice,
      };
      const res = await axios.post(`${API_URL}/bookings/create`, bookingData);
      alert(`✅ Booking successful! Booking ID: ${res.data._id}`);
      setSelectedSeats([]);
      setTotalPrice(0);
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("Failed to complete booking");
    }
  };

  return (
    <div className="user-page">
      <h2>🎬 Movie Booking Dashboard</h2>

      {/* ✅ Step 1: Movie List */}
      {!selectedMovie && (
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-card" onClick={() => handleMovieSelect(movie)}>
              <img src={movie.poster} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>
                {movie.language} | {movie.genres?.join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Step 2: Movie Details + Booking Steps */}
      {selectedMovie && (
        <div className="movie-details">
          <h3>{selectedMovie.title}</h3>
          <p>{selectedMovie.description}</p>
          <button className="back-btn" onClick={() => setSelectedMovie(null)}>
            ⬅ Back to Movies
          </button>

          {/* ✅ Screens */}
          <h4>Select Screen:</h4>
          <div className="screen-list">
            {screens.map((screen) => (
              <button
                key={screen._id}
                className={selectedScreen?._id === screen._id ? "active" : ""}
                onClick={() => handleScreenSelect(screen)}
              >
                Screen {screen.number}
              </button>
            ))}
          </div>

          {/* ✅ Shows */}
          {selectedScreen && (
            <>
              <h4>Select Showtime:</h4>
              <div className="show-list">
                {shows.map((show) => (
                  <button
                    key={show._id}
                    className={selectedShow?._id === show._id ? "active" : ""}
                    onClick={() => handleShowSelect(show)}
                  >
                    {show.time}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ✅ Seat Layout */}
          {loading && <p>Loading seat layout...</p>}
          {!loading && seatLayout.length > 0 && (
            <>
              <h4>Select Seats:</h4>
              <div className="seat-grid">
                {seatLayout.map((row, rIndex) => (
                  <div key={rIndex} className="seat-row">
                    {row.map((seat, cIndex) => (
                      <div
                        key={cIndex}
                        className={`seat ${
                          selectedSeats.includes(`${rIndex}-${cIndex}`)
                            ? "selected"
                            : seat.booked
                            ? "booked"
                            : ""
                        }`}
                        onClick={() => !seat.booked && toggleSeat(rIndex, cIndex)}
                      >
                        {seat.label}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ✅ Booking Summary */}
              <div className="booking-summary">
                <p>🎟️ Selected Seats: {selectedSeats.length}</p>
                <p>💰 Total: ₹{totalPrice}</p>
                <button className="book-btn" onClick={handleBookNow}>
                  Book Now
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
