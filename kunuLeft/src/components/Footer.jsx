import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h2 className="footer-logo">KUNULINK</h2>
          <p>Connecting Communities for a Cleaner Future.</p>
          <p className="footer-text">
            Your digital partner in responsible waste management in Sri Lanka.
          </p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/#services">Services</a></li>
            <li><a href="/eco-guide">Eco Guide</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📧 support@kunulink.lk</p>
          <p>📞 +94 77 123 4567</p>
          <p>📍 Sri Lanka</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} KUNULINK. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;