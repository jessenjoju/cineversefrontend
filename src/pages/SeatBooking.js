import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SeatBooking.css";

export default function SeatBooking({ movieId, showId, userId, onClose }) {
  const rows = ["A","B","C","D","E","F","G","H","I","J"];
  const seatsPerRow = 12;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Seat pricing based on row
  const getSeatPrice = (seatId) => {
    const row = seatId[0];
    if (["A", "B", "C"].includes(row)) return 100;
    if (["D", "E", "F", "G"].includes(row)) return 200;
    if (["H", "I", "J"].includes(row)) return 300;
    return 0;
  };

  // Fetch booked seats when page loads
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/bookings/show/${showId}`);
        setBookedSeats(res.data); // array of seat IDs
      } catch (err) {
        console.error("Error fetching booked seats", err);
      }
    };
    fetchBookedSeats();
  }, [showId]);

  // Toggle seat selection
  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return; // cannot select booked seat
    setSelectedSeats((prev) => {
      const updatedSeats = prev.includes(seatId)
        ? prev.filter((s) => s !== seatId) // deselect
        : [...prev, seatId]; // select

      // Update total price
      const newTotal = updatedSeats.reduce((acc, seat) => acc + getSeatPrice(seat), 0);
      setTotalPrice(newTotal);

      return updatedSeats;
    });
  };

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) return;

    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        userId,
        movieId,
        showId,
        seats: selectedSeats,
      });

      if (res.data.success) {
        alert(`✅ Booking confirmed! Total: ₹${totalPrice}`);
        setBookedSeats((prev) => [...prev, ...selectedSeats]);
        setSelectedSeats([]);
        setTotalPrice(0);
        if (onClose) onClose(); // close overlay
      } else {
        alert("⚠️ " + res.data.error || "Unknown error");
      }
    } catch (err) {
      console.error("Booking error", err);
      alert("❌ Error booking seats");
    }
  };

  return (
    <div className="seat-booking-container">
      <h2>Select Your Seats</h2>
      <div className="screen">SCREEN</div>

      <div className="seats-grid">
        {rows.map((row) =>
          Array.from({ length: seatsPerRow }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            const isBooked = bookedSeats.includes(seatId);
            const price = getSeatPrice(seatId);

            return (
              <div
                key={seatId}
                className={`seat ${isSelected ? "selected" : ""} ${isBooked ? "booked" : ""}`}
                onClick={() => toggleSeat(seatId)}
                title={`₹${price}`}
              >
                {seatId}
              </div>
            );
          })
        )}
      </div>

      <div className="booking-summary">
        <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
        <p>Total Price: ₹{totalPrice}</p>
      </div>

      <button
        className="confirm-btn"
        disabled={selectedSeats.length === 0}
        onClick={handleConfirmBooking}
      >
        Confirm Booking ({selectedSeats.length} seats)
      </button>

      {onClose && (
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
}
