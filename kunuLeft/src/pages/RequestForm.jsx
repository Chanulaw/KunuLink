import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../App.css';

// Marker Icon Fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map Controller - ස්වයංක්‍රීය GPS කිසිවක් මෙහි නැත
function MapController({ setPosition }) {
  const map = useMap();
  
  useEffect(() => {
    // සිතියම නිසි ලෙස පෙන්වීමට පමණක් උපකාරී වේ
    map.invalidateSize();
  }, [map]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng); // සිතියමේ ක්ලික් කරන තැන marker එක වැටේ
    },
  });
  return null;
}

function RequestForm() {
  const [position, setPosition] = useState(null);
  const [wasteType, setWasteType] = useState('Plastic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!position) {
      alert("කරුණාකර සිතියම මත ඔබ සිටින ස්ථානය ක්ලික් කර සලකුණු කරන්න.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'requests'), {
        userName: "Registered User",
        wasteType: wasteType,
        location: { lat: position.lat, lng: position.lng },
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      alert("සාර්ථකව ඉල්ලීම යොමු කරන ලදී!");
      setPosition(null); 
    } catch (error) {
      console.error("Error: ", error);
      alert("දත්ත ගබඩාවට යැවීමේදී දෝෂයක් සිදුවිය.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="request-grid">
        
        {/* වම් පැත්ත: Map */}
        <div className="map-section">
          <div className="map-wrapper">
            <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapController setPosition={setPosition} />
              {position && <Marker position={position}></Marker>}
            </MapContainer>
          </div>
        </div>

        {/* දකුණු පැත්ත: Form */}
        <div className="form-section">
          <div className="request-card">
            <h2>New Request</h2>
            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <label>Waste Type</label>
                <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="modern-input">
                  <option value="Plastic">Plastic</option>
                  <option value="E-waste">E-waste</option>
                  <option value="Glass">Glass</option>
                  <option value="Hazardous">Hazardous</option>
                </select>
              </div>

              <div className="location-info-box">
                <p>Selected Location: {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "සිතියම මත ක්ලික් කරන්න"}</p>
              </div>

              <button type="submit" className="submit-request-btn" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Submit Collection Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestForm;