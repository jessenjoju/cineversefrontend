import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddShow() {
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [form, setForm] = useState({
    movie: "",
    theatre: "",
    screenName: "",
    shows: [{ date: "", session: "" }] // ✅ FN/AN session
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/movies").then((res) => setMovies(res.data));
    axios.get("http://localhost:5000/api/theatres").then((res) => setTheatres(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle show timing change
  const handleShowChange = (index, e) => {
    const updatedShows = [...form.shows];
    updatedShows[index][e.target.name] = e.target.value;
    setForm({ ...form, shows: updatedShows });
  };

  // Add new show field
  const addShowField = () => {
    if (form.shows.length >= 7) {
      alert("❌ Maximum 7 shows allowed");
      return;
    }
    setForm({ ...form, shows: [...form.shows, { date: "", session: "" }] });
  };

  // Remove a show field
  const removeShowField = (index) => {
    if (form.shows.length <= 2) {
      alert("❌ At least 2 shows are required");
      return;
    }
    const updatedShows = form.shows.filter((_, i) => i !== index);
    setForm({ ...form, shows: updatedShows });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert FN/AN sessions → real showTime
    const showsWithDate = form.shows.map((s) => {
      let timePart = s.session === "FN" ? "10:00" : "15:00"; // example mapping
      const showTime = new Date(`${s.date}T${timePart}:00`);
      return { showTime };
    });

    try {
      await axios.post("http://localhost:5000/api/shows/add", {
        movie: form.movie,
        theatre: form.theatre,
        screenName: form.screenName,
        shows: showsWithDate
      });
      alert("✅ Shows Scheduled!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to schedule shows");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select name="movie" onChange={handleChange}>
        <option>Select Movie</option>
        {movies.map((m) => (
          <option key={m._id} value={m._id}>{m.title}</option>
        ))}
      </select>

      <select name="theatre" onChange={handleChange}>
        <option>Select Theatre</option>
        {theatres.map((t) => (
          <option key={t._id} value={t._id}>{t.name}</option>
        ))}
      </select>

      <input name="screenName" placeholder="Screen Name" onChange={handleChange} />

      <h3>🎬 Show Timings</h3>
      {form.shows.map((s, index) => (
        <div key={index}>
          <input
            type="date"
            name="date"
            value={s.date}
            onChange={(e) => handleShowChange(index, e)}
          />
          <select
            name="session"
            value={s.session}
            onChange={(e) => handleShowChange(index, e)}
          >
            <option value="">Select Session</option>
            <option value="FN">FN (10:00 AM)</option>
            <option value="AN">AN (03:00 PM)</option>
          </select>
          <button type="button" onClick={() => removeShowField(index)}>❌</button>
        </div>
      ))}
      <button type="button" onClick={addShowField}>➕ Add Show</button>

      <br />
      <button type="submit">Save Shows</button>
    </form>
  );
}
