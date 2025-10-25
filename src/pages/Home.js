import React, { useState } from "react";
import "./HomePage.css";
// NOTE: Ensure this image file exists at the path "../assets/avengers-infinity-war-poster.jpg"
import moviePoster from "../assets/avengers-infinity-war-poster.jpg"; 

// YouTube Embed URL for Avengers: Infinity War Official Trailer
const TRAILER_URL = "https://www.youtube.com/embed/6ZfuNTqbHE8?autoplay=1";

const HomePage = () => {
  // State to control the visibility of the trailer modal
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  // Click handler to show the trailer modal
  const handleWatchTrailer = () => {
    setIsTrailerOpen(true);
  };
  
  // Handler to close the trailer modal
  const handleCloseTrailer = () => {
    setIsTrailerOpen(false);
  };

  return (
    <div
      className="homepage-container"
      style={{
        backgroundImage: `url(${moviePoster})`,
      }}
    >
      {/* Hero Overlay and Content */}
      <div className="hero-overlay">
        
        {/* Navigation Bar/Header omitted */}

        <div className="hero-content">
          <h1 className="movie-title">Avengers: Infinity War</h1>
          
          <div className="genre-tags">
            <span className="tag">ADVENTURE</span>
            <span className="tag">FANTASY</span>
            <span className="tag">ACTION</span>
          </div>

          <p className="metadata">
            English • April 27, 2018 • (USA) • 2h 38m
          </p>

          <p className="movie-description">
            The Avengers and their allies must be willing to sacrifice all in
            an attempt to defeat the powerful Thanos before his blitz of
            devastation and ruin puts an end to the universe.
          </p>

          <div className="cta-section">
            <div className="rating-container">
                <span className="rating">99%</span>
                <p className="want-to-see">want to see</p>
            </div>
            <div className="action-buttons">
              {/* Button with the click handler */}
              <button className="btn trailer-btn" onClick={handleWatchTrailer}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Watch Trailer
              </button>
              
              <button className="btn tickets-btn">
                Book Tickets 
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 5V3a2 2 0 0 0-2-2h-2.48a2 2 0 0 0-1.08.31l-.9.69a2 2 0 0 1-1.08.31H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.19a2 2 0 0 1 1.08.31l.9.69a2 2 0 0 0 1.08.31H16a2 2 0 0 0 2-2v-2"></path>
                    <path d="M18 5h-2.58a2 2 0 0 1-1.42-.59l-.7-.7a2 2 0 0 0-1.42-.59H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.19"></path>
                    <circle cx="16" cy="9" r="2"></circle>
                    <circle cx="16" cy="15" r="2"></circle>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Modal (Conditionally Rendered) */}
      {isTrailerOpen && (
        <div className="trailer-modal-backdrop" onClick={handleCloseTrailer}>
          <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              width="100%"
              height="100%"
              src={TRAILER_URL}
              title="Avengers: Infinity War Official Trailer"
              frameBorder="0"
              // Updated to include 'web-share' for robust modern embedding
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
            {/* Close button positioned above the video */}
            <button className="close-trailer-btn" onClick={handleCloseTrailer}>
                &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;