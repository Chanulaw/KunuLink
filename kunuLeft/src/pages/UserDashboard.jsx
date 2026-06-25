import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import "../App.css";

function UserDashboard() {
  const [wasteType, setWasteType] =
    useState("Plastic");

  const [userName, setUserName] =
    useState("User");

  const [isLoading, setIsLoading] =
    useState(false);

  const [location, setLocation] =
    useState({
      lat: null,
      lng: null,
    });

  // Get username
  useEffect(() => {
    const storedName =
      localStorage.getItem("activeUserName") ||
      localStorage.getItem("username");

    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  // Get GPS Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log(
            "Location Error:",
            error
          );

          alert(
            "Please allow location access for live tracking."
          );
        }
      );
    }
  }, []);

  // Submit Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Check location
    if (
      location.lat === null ||
      location.lng === null
    ) {
      alert(
        "Location not available. Please enable GPS."
      );
      setIsLoading(false);
      return;
    }

    try {
      const requestsRef =
        collection(db, "requests");

      await addDoc(requestsRef, {
        userId:
          auth.currentUser?.uid ||
          localStorage.getItem("uid"),

        userName: userName,
        wasteType: wasteType,
        status: "pending",
        createdAt: serverTimestamp(),

        // GPS coordinates
        lat: location.lat,
        lng: location.lng,
      });

      alert(
        "✅ Your collection request has been submitted successfully!"
      );

      setWasteType("Plastic");
    } catch (error) {
      console.error(error);

      alert(
        "❌ Error submitting request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in">

      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1 className="dash-welcome-text">
          Hello, <span>{userName}</span> 👋
        </h1>

        <p className="dash-subtitle">
          ඔබේ අපද්‍රව්‍ය කළමනාකරණ කටයුතු මෙතැනින් ආරම්භ කරන්න.
        </p>
      </div>

      <div className="dash-grid-layout">

        {/* Map */}
        <div className="dash-glass-card map-holder">

          <h2 className="dash-section-title">
            📍 Your Current Location
          </h2>

          <div className="map-wrapper">
            <iframe
              title="Map"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${
                location.lat || 6.9271
              },${
                location.lng || 79.8612
              }&z=15&output=embed`}
            />
          </div>

          <p
            style={{
              marginTop: "15px",
              fontWeight: "600",
            }}
          >
            Latitude :
            {location.lat
              ? ` ${location.lat}`
              : " Loading..."}
          </p>

          <p
            style={{
              fontWeight: "600",
            }}
          >
            Longitude :
            {location.lng
              ? ` ${location.lng}`
              : " Loading..."}
          </p>

        </div>

        {/* Request Form */}
        <div className="dash-glass-card form-holder">

          <h2 className="dash-section-title">
            ♻️ New Collection Request
          </h2>

          <form
            onSubmit={handleSubmit}
            className="eco-form"
          >

            <div className="input-group">
              <label>
                Waste Type
              </label>

              <select
                value={wasteType}
                onChange={(e) =>
                  setWasteType(
                    e.target.value
                  )
                }
                className="eco-select-field"
                disabled={isLoading}
              >
                <option value="Plastic">
                  Plastic (ප්ලාස්ටික්)
                </option>

                <option value="Glass">
                  Glass (වීදුරු)
                </option>

                <option value="Paper">
                  Paper (කඩදාසි)
                </option>

                <option value="Electronic">
                  Electronic
                  (විද්‍යුත්)
                </option>
              </select>
            </div>

            <div className="input-group">
              <label>
                Upload Photo
                (Optional)
              </label>

              <input
                type="file"
                className="eco-file-field"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="dash-submit-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Submitting..."
                : "Submit Disposal Request"}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default UserDashboard;