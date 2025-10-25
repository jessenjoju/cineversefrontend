// models/TheatreScreen.js
const mongoose = require("mongoose");

const theatreScreenSchema = new mongoose.Schema({
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre", required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  screenNumber: { type: Number, required: true },
  shows: [
    {
      time: { type: String, required: true }, // e.g. "10:00 AM"
      availableSeats: { type: Number, default: 100 },
    },
  ],
});

module.exports = mongoose.model("TheatreScreen", theatreScreenSchema);
