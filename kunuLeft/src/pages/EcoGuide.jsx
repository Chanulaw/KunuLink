import React, { useEffect } from "react";
import "../App.css";

import recycleImg from "../assets/recycle.jpeg";
import organicImg from "../assets/organic.jpeg";
import hazardousImg from "../assets/hazard.jpeg";

function EcoGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="eco-page animate-fade-in">

      {/* HEADER */}
      <section className="eco-header-card">
        <h1 className="logo-text">
          Eco<span>Guide</span>
        </h1>

        <p className="eco-tagline">
          Before submitting a waste request, learn how to sort waste correctly.
          <br />
          ඉල්ලීමක් යොමු කිරීමට පෙර අපද්‍රව්‍ය නිවැරදිව වර්ග කරන්න.
        </p>
        <br />  
        <div className="eco-note">
          ♻️ This guide helps improve proper waste collection in your area
        </div>
      </section>

      {/* CARDS */}
      <section className="eco-grid">

        <div className="eco-card">
          <img src={recycleImg} alt="Recyclable" className="card-img" />
          <h2>Recyclable Waste</h2>
          <p>Plastic, paper, glass, metal</p>
        </div>

        <div className="eco-card">
          <img src={organicImg} alt="Organic" className="card-img" />
          <h2>Organic Waste</h2>
          <p>Food waste, leaves, natural waste</p>
        </div>

        <div className="eco-card">
          <img src={hazardousImg} alt="Hazardous" className="card-img" />
          <h2>Hazardous Waste</h2>
          <p>Batteries, chemicals, electronics</p>
        </div>

      </section>

      {/* SIMPLE STEPS (cleaned) */}
      <section className="eco-info-card">
        <h2>How It Works</h2>

        <div className="tips-grid">
          <div>1️⃣ Identify waste</div>
          <div>2️⃣ Choose category</div>
          <div>3️⃣ Submit request</div>
          <div>4️⃣ We collect it</div>
        </div>
      </section>

    </div>
  );
}

export default EcoGuide;