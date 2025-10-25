import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
    return (
        <header className="main-header">
            <div className="header-left">
                
                <span className="brand-name">Cineverse</span>
            </div>

            <nav className="header-nav">
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>

            <div className="header-right">
                <Link to="/login" className="signin-link">Sign in</Link>
            </div>
        </header>
    );
}
