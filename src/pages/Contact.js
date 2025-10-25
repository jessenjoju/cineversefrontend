import React from "react";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <p>We’d love to hear from you! Reach out through any of the options below.</p>

      <div className="contact-grid">
        <a href="tel:+911234567890" className="contact-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/597/597177.png"
            alt="Phone"
          />
          <h3>Call Us</h3>
          <p>+91 12345 67890</p>
        </a>

        <a href="mailto:example@email.com" className="contact-card">
          <img
            src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
            alt="Email"
          />
          <h3>Email</h3>
          <p>example@email.com</p>
        </a>

        <a
          href="https://www.google.com/maps/place/Taj+Mahal"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
            alt="Location"
          />
          <h3>Visit Us</h3>
          <p>123, Main Street, Your City</p>
        </a>

        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-card"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
            alt="Facebook"
          />
          <h3>Facebook</h3>
          <p>@yourpage</p>
        </a>
      </div>
    </div>
  );
}
