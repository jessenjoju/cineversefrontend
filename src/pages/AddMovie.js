import React, { useState } from "react";
import axios from "axios";
import "./AddMovie.css";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState(180);
  const [certification, setCertification] = useState("U");
  const [genres, setGenres] = useState([]);
  const [language, setLanguage] = useState("English");
  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState("");
  const [actors, setActors] = useState([]);
  const [isActive, setIsActive] = useState(true);

  // 🎬 New screen and show management
  const [numberOfScreens, setNumberOfScreens] = useState(1);
  const [screens, setScreens] = useState([
    { screenNumber: 1, shows: [], seating: { rows: 5, columns: 10, priceMap: {} } },
  ]);

  const genreOptions = [
    "Action", "Horror", "Thriller", "Romance", "Science fiction", "Drama",
    "Comedy", "Western", "Crime film", "Fantasy", "Animation", "Documentary",
    "Adventure", "Noir", "War", "Experimental", "Crime fiction", "Romantic comedy",
    "Magical Realism", "Music", "Mystery", "Sports", "Television", "Children's film",
    "Martial Arts", "Historical film", "Dark comedy", "Musical", "Action/Adventure",
    "Science fiction", "Historical drama", "History", "Narrative", "Science",
    "Animated film", "Melodrama", "Disaster", "Fairy tale", "Cyberpunk",
    "High fantasy", "Heist", "Fantasy comedy",
  ];

  const languageOptions = [
    "English", "Malayalam", "Hindi", "Tamil", "Telugu", "Kannada",
    "Spanish", "Japanese", "Chinese", "French", "German", "Italian",
    "Korean", "Russian", "Arabic", "Portuguese",
  ];

  // 🖼️ Poster
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPoster(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  // 🎭 Actors
  const addActor = () => setActors([...actors, { name: "", image: null, preview: "" }]);
  const handleActorChange = (i, f, v) => {
    const updated = [...actors];
    updated[i][f] = v;
    setActors(updated);
  };
  const handleActorImageChange = (i, e) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...actors];
      updated[i].image = file;
      updated[i].preview = URL.createObjectURL(file);
      setActors(updated);
    }
  };
  const removeActor = (i) => {
    const updated = [...actors];
    updated.splice(i, 1);
    setActors(updated);
  };

  // 🎞️ Screens & Shows
  const handleScreenCountChange = (num) => {
    setNumberOfScreens(num);
    const updatedScreens = [];
    for (let i = 0; i < num; i++) {
      updatedScreens.push(
        screens[i] || {
          screenNumber: i + 1,
          shows: [],
          seating: { rows: 5, columns: 10, priceMap: {} },
        }
      );
    }
    setScreens(updatedScreens);
  };

  const addShow = (screenIndex) => {
    const time = prompt("Enter show time (e.g. 10:00 AM):");
    if (time) {
      const updated = [...screens];
      updated[screenIndex].shows.push({ time });
      setScreens(updated);
    }
  };

  const removeShow = (screenIndex, showIndex) => {
    const updated = [...screens];
    updated[screenIndex].shows.splice(showIndex, 1);
    setScreens(updated);
  };

  // 💺 Seating
  const handleSeatingChange = (screenIndex, field, value) => {
    const updated = [...screens];
    updated[screenIndex].seating[field] = parseInt(value) || 0;
    setScreens(updated);
  };

  const addPriceRow = (screenIndex) => {
    const rowLetter = prompt("Enter row letter (e.g. A, B, C):");
    const price = prompt("Enter price for this row:");
    if (rowLetter && price) {
      const updated = [...screens];
      updated[screenIndex].seating.priceMap[rowLetter.toUpperCase()] = Number(price);
      setScreens(updated);
    }
  };

  const removePriceRow = (screenIndex, rowLetter) => {
    const updated = [...screens];
    delete updated[screenIndex].seating.priceMap[rowLetter];
    setScreens(updated);
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("releaseDate", releaseDate);
    formData.append("duration", duration);
    formData.append("certification", certification);
    formData.append("language", language);
    formData.append("genres", genres.join(","));
    formData.append("isActive", isActive);
    formData.append("numberOfScreens", numberOfScreens);
    formData.append("screens", JSON.stringify(screens));

    if (poster) formData.append("poster", poster);
    actors.forEach((actor, i) => {
      formData.append(`actors[${i}][name]`, actor.name);
      if (actor.image) formData.append(`actors[${i}][image]`, actor.image);
    });

    try {
      await axios.post("http://localhost:5000/api/movies/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("🎬 Movie added successfully!");

      // reset
      setTitle("");
      setDescription("");
      setReleaseDate("");
      setDuration(180);
      setCertification("U");
      setLanguage("English");
      setGenres([]);
      setPoster(null);
      setPosterPreview("");
      setActors([]);
      setIsActive(true);
      setNumberOfScreens(1);
      setScreens([{ screenNumber: 1, shows: [], seating: { rows: 5, columns: 10, priceMap: {} } }]);
    } catch (err) {
      console.error("❌ Error adding movie:", err);
      alert("❌ Failed to add movie");
    }
  };

  return (
    <div className="add-movie-container">
      <h2 className="add-movie-header">Add New Movie</h2>

      <form className="movie-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Movie Title</label>
        <input
          type="text"
          placeholder="Enter movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Movie description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Release Date</label>
        <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />

        <label>Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          min={1}
          required
        />

        <label>Certification</label>
        <select value={certification} onChange={(e) => setCertification(e.target.value)}>
          <option value="U">U (Universal)</option>
          <option value="U/A 7+">U/A 7+</option>
          <option value="U/A 13+">U/A 13+</option>
          <option value="U/A 16+">U/A 16+</option>
          <option value="A">A (Adults Only)</option>
          <option value="S">S (Specialized Audience)</option>
        </select>

        <label>Genres</label>
        <select
          multiple
          value={genres}
          onChange={(e) => setGenres(Array.from(e.target.selectedOptions, (opt) => opt.value))}
        >
          {genreOptions.map((genre, i) => (
            <option key={i} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languageOptions.map((lang, i) => (
            <option key={i} value={lang}>
              {lang}
            </option>
          ))}
        </select>

        <label>Poster Image</label>
        <input type="file" accept="image/*" onChange={handlePosterChange} />
        {posterPreview && <img src={posterPreview} alt="Poster Preview" className="poster-preview" />}

        {/* 🎬 Screens Config */}
        <div className="screens-section">
          <h4>🎥 Screen Configuration</h4>

          <label>Number of Screens</label>
          <select
            value={numberOfScreens}
            onChange={(e) => handleScreenCountChange(parseInt(e.target.value))}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>

          {screens.map((screen, sIndex) => (
            <div key={sIndex} className="screen-block">
              <h5>📽️ Screen {screen.screenNumber}</h5>

              <div>
                <strong>Shows:</strong>{" "}
                <button type="button" onClick={() => addShow(sIndex)}>
                  ➕ Add Show
                </button>
              </div>
              <ul>
                {screen.shows.map((show, i) => (
                  <li key={i}>
                    {show.time}{" "}
                    <button type="button" onClick={() => removeShow(sIndex, i)}>
                      ❌
                    </button>
                  </li>
                ))}
              </ul>

              <div>
                <strong>Seating Layout:</strong>
                <br />
                Rows:{" "}
                <input
                  type="number"
                  value={screen.seating.rows}
                  onChange={(e) => handleSeatingChange(sIndex, "rows", e.target.value)}
                  min={1}
                />{" "}
                Columns:{" "}
                <input
                  type="number"
                  value={screen.seating.columns}
                  onChange={(e) => handleSeatingChange(sIndex, "columns", e.target.value)}
                  min={1}
                />
              </div>

              <div>
                <strong>Row Price Map:</strong>{" "}
                <button type="button" onClick={() => addPriceRow(sIndex)}>
                  ➕ Add Row Price
                </button>
                <ul>
                  {Object.entries(screen.seating.priceMap).map(([row, price]) => (
                    <li key={row}>
                      Row {row}: ₹{price}{" "}
                      <button type="button" onClick={() => removePriceRow(sIndex, row)}>
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* 🎭 Actors Section */}
        <div className="actors-section">
          <h4>
            Actors & Actresses{" "}
            <button type="button" className="add-actor-btn" onClick={addActor}>
              +
            </button>
          </h4>

          {actors.map((actor, index) => (
            <div key={index} className="actor-item">
              <input
                type="text"
                placeholder="Actor name"
                value={actor.name}
                onChange={(e) => handleActorChange(index, "name", e.target.value)}
                required
              />
              <input type="file" accept="image/*" onChange={(e) => handleActorImageChange(index, e)} />
              {actor.preview && <img src={actor.preview} alt="Actor Preview" />}
              <button type="button" className="remove-actor-btn" onClick={() => removeActor(index)}>
                ❌
              </button>
            </div>
          ))}
        </div>

        <label>
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />{" "}
          Active Movie
        </label>

        <button type="submit" className="submit-btn">
          Add Movie
        </button>
      </form>
    </div>
  );
}
