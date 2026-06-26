import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "../App.css";

// Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function UserDashboard() {
  const [wasteType, setWasteType] = useState("Plastic");
  const [userName, setUserName] = useState("User");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 7.8731, lng: 80.7718 }); // Sri Lanka center

  useEffect(() => {
    const storedName = localStorage.getItem("activeUserName") || localStorage.getItem("username");
    if (storedName) setUserName(storedName);

    // Location ලබා ගැනීමට උත්සාහ කරයි, බැරි වුවහොත් default Sri Lanka ලක්ෂ්‍යය පවතී
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("GPS disabled, using default SL location.")
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "requests"), {
        userId: auth.currentUser?.uid || localStorage.getItem("uid"),
        userName: userName,
        wasteType: wasteType,
        status: "pending",
        createdAt: serverTimestamp(),
        lat: location.lat,
        lng: location.lng,
      });
      alert("✅ Your collection request has been submitted successfully!");
      setWasteType("Plastic");
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="welcome-banner">
        <h1 className="dash-welcome-text">Hello, <span>{userName}</span> 👋</h1>
        <p className="dash-subtitle">ඔබේ අපද්‍රව්‍ය කළමනාකරණ කටයුතු මෙතැනින් ආරම්භ කරන්න.</p>
      </div>

      <div className="dash-grid-layout">
        {/* Map */}
        <div className="dash-glass-card map-holder">
          <h2 className="dash-section-title">📍 Your Location (Sri Lanka)</h2>
          <div className="map-wrapper" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
            <MapContainer center={[location.lat, location.lng]} zoom={8} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[location.lat, location.lng]} />
            </MapContainer>
          </div>
        </div>

        {/* Request Form */}
        <div className="dash-glass-card form-holder">
          <h2 className="dash-section-title">♻️ New Collection Request</h2>
          <form onSubmit={handleSubmit} className="eco-form">
            <div className="input-group">
              <label>Waste Type</label>
              <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="eco-select-field">
                <option value="Plastic">Plastic (ප්ලාස්ටික්)</option>
                <option value="Glass">Glass (වීදුරු)</option>
                <option value="Paper">Paper (කඩදාසි)</option>
                <option value="Electronic">Electronic (විද්‍යුත්)</option>
              </select>
            </div>
            <div className="input-group">
              <label>Upload Photo (Optional)</label>
              <input type="file" className="eco-file-field" />
            </div>
            <button type="submit" className="dash-submit-btn" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Disposal Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;