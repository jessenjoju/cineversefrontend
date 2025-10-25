import React from "react";
import "./About.css";
import aboutImage from "./cinema1.jpg"; // replace with your image path

export default function About() {
  return (
    <div className="about-container">
      <div className="about-image">
        <img src={aboutImage} alt="About" />
      </div>
      <div className="about-content">
        <h1>7 Steamy Movies That Started As Erotic Fan Fiction</h1>
        <div className="author">
          <img
            src="https://via.placeholder.com/40"
            alt="Author"
            className="author-image"
          />
          <span className="author-name">Anushree Arora</span>
          <span className="author-role">JustWatch Editor</span>
        </div>
        <p>
          When you hear Wattpad, you probably think of 12 year olds writing fan
          fiction under their covers on their cracked iPhone screens, armed with
          questionable grammar, excessive ellipses, and characters who let out a
          deep breath they didn’t know they were holding...
        </p>
      </div>
    </div>
  );
}
