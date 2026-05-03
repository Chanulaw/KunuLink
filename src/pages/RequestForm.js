import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../App.css';

// Marker Icon Fix - Leaflet marker එක හරියට පෙන්වීමට මෙය අවශ්‍යයි
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map Controller Component
function MapController({ setPosition }) {
  const map = useMap();
  
  useEffect(() => {
    // සිතියම load වූ සැණින් Location එක සෙවීම
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    });

    // CSS ප්‍රශ්න මගහරවා ගැනීමට සිතියම Refresh කිරීම
    setTimeout(() => {
      map.invalidateSize();
    }, 500);
  }, [map, setPosition]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
}

function RequestForm() {
  const [position, setPosition] = useState(null);
  const [wasteType, setWasteType] = useState('Plastic');
  const [photo, setPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !photo) {
      alert("කරුණාකර සිතියම මත ස්ථානය සහ ඡායාරූපයක් ලබා දෙන්න.");
      return;
    }
    setIsSubmitting(true);
    // දත්ත ගබඩා කිරීමේ ක්‍රියාවලිය අනුකරණය කිරීම (Simulation)
    setTimeout(() => {
      alert(`සාර්ථකයි! \nස්ථානය: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="form-page-container">
      <div className="request-grid">
        
        {/* වම් පැත්ත: Leaflet Map */}
        <div className="map-section animate-slide-left">
          <div className="map-wrapper">
            <MapContainer 
              center={[6.9271, 79.8612]} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <MapController setPosition={setPosition} />
              {position && <Marker position={position}></Marker>}
            </MapContainer>
            {!position && (
              <div className="map-hint-bubble">
                📍 සිතියම මත ඔබ සිටින ස්ථානය සලකුණු කරන්න
              </div>
            )}
          </div>
        </div>

        {/* දකුණු පැත්ත: Form Details */}
        <div className="form-section animate-fade-in">
          <div className="request-card">
            <h2 className="form-title">New Collection Request</h2>
            <p className="form-subtitle">අපද්‍රව්‍ය ඉවත් කිරීමට අවශ්‍ය තොරතුරු ලබා දෙන්න</p>

            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <label>Waste Type</label>
                <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="modern-input">
                  <option>Plastic</option>
                  <option>E-waste</option>
                  <option>Glass</option>
                  <option>Hazardous</option>
                </select>
              </div>

              <div className="input-group">
                <label>Upload Photo</label>
                <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} className="file-input" required />
              </div>

              <div className="location-info-box">
                <span className="loc-icon">📍</span>
                <div>
                  <p className="loc-label">Selected Coordinates</p>
                  <p className="loc-coords">
                    {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "සිතියම මත ක්ලික් කරන්න"}
                  </p>
                </div>
              </div>

              <button type="submit" className="submit-request-btn" disabled={isSubmitting}>
                {isSubmitting ? "Processing Request..." : "Submit Collection Request"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RequestForm;