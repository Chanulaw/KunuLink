import React from "react";
import "../App.css";
import Navbar from "../components/Navbar";

import recycleImg from "../assets/recycle.jpeg";
import organicImg from "../assets/organic.jpeg";
import hazardousImg from "../assets/hazard.jpeg";

function EcoSorting() {
  return (
      <div className="eco-page animate-fade-in">
      {/* Header Card */}
      <section className="eco-header-card">
        <h1 className="logo-text">
          Eco<span>Sorting</span>
        </h1>

        <p className="eco-tagline">
          Learn how to separate waste correctly and protect the environment in Sri Lanka.
        </p>
      </section>

      {/* Waste Categories */}
      <section className="eco-grid">
        <div className="eco-card">
          <img src={recycleImg} alt="Recyclable" className="card-img" />

          <h2>♻️ Recyclable Waste</h2>

          <ul>
            <li>Plastic bottles</li>
            <li>Paper / Cardboard</li>
            <li>Glass bottles</li>
            <li>Metal cans</li>
          </ul>

          <button className="eco-btn blue-btn">
            Use Blue Bin
          </button>
        </div>

        <div className="eco-card">
          <img src={organicImg} alt="Organic" className="card-img" />

          <h2>🌿 Organic Waste</h2>

          <ul>
            <li>Food scraps</li>
            <li>Fruit peels</li>
            <li>Tea leaves</li>
            <li>Leaves</li>
          </ul>

          <button className="eco-btn green-btn">
            Use Green Bin
          </button>
        </div>

        <div className="eco-card">
          <img src={hazardousImg} alt="Hazardous" className="card-img" />

          <h2>⚠️ Hazardous Waste</h2>

          <ul>
            <li>Batteries</li>
            <li>Medical waste</li>
            <li>Broken electronics</li>
            <li>Chemicals</li>
          </ul>

          <button className="eco-btn red-btn">
            Use Red Bin
          </button>
        </div>
      </section>

      {/* Sorting Steps */}
      <section className="eco-info-card">
        <h2>🧭 How to Sort</h2>

        <div className="tips-grid">
          <div>1️⃣ Identify waste</div>
          <div>2️⃣ Choose correct bin</div>
          <div>3️⃣ Dispose properly</div>
          <div>4️⃣ Make an impact</div>
        </div>
      </section>

      {/* Tips */}
      <section className="eco-info-card">
        <h2>💡 Quick Tips</h2>

        <div className="tips-grid">
          <div>🚿 Clean recyclables before disposing</div>
          <div>🔁 Reduce & Reuse whenever possible</div>
          <div>🌱 Compost organic waste</div>
          <div>📢 Spread awareness</div>
        </div>
      </section>

    </div>

  );
}

export default EcoSorting;