import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { db } from '../firebase'; // Firebase config එක import කිරීම
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../App.css';

// Marker Icon Fix - Leaflet සිතියමේ Icon එක හරියට පෙන්වීමට මෙය අනිවාර්යයි
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map Controller - සිතියම පාලනය කිරීමට
function MapController({ setPosition }) {
  const map = useMap();
  
  useEffect(() => {
    // Page එක ලෝඩ් වෙද්දීම User ඉන්න තැන සෙවීම
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
    });

    // CSS ප්‍රශ්න නිසා මැප් එක කැඩිලා පේන එක වැළැක්වීමට
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Firebase එකට දත්ත සේව් කරන handleSubmit Function එක
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!position) {
      alert("කරුණාකර සිතියම මත ඔබ සිටින ස්ථානය (Location) සලකුණු කරන්න.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Firebase Firestore එකේ 'requests' collection එකට දත්ත ඇතුළත් කිරීම
      await addDoc(collection(db, 'requests'), {
        user: "Registered User", // පසුව Authentication හරහා සැබෑ User Name එක දැමිය හැක
        userName: "Registered User",
        wasteType: wasteType,
        type: wasteType,
        location: {
          lat: position.lat,
          lng: position.lng
        },
        status: 'Pending', // මුලින්ම වැටෙන්නේ Pending ලෙසයි
        employee: 'Not Assigned',
        createdAt: serverTimestamp() // සාදනු ලැබූ වේලාව සේව් කිරීම
      });

      alert("අපද්‍රව්‍ය එකතු කිරීමේ ඉල්ලීම සාර්ථකව ගබඩා කරන ලදී! (Request Submitted Successfully)");
      
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Firebase දත්ත ගබඩාවට ඇතුළත් කිරීමේදී දෝෂයක් සිදුවිය.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-page-container">
      <div className="request-grid">
        
        {/* වම් පැත්ත: Live Interactive Map */}
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
                📍 සිතියම මත ඔබ සිටින ස්ථානය ක්ලික් කර සලකුණු කරන්න
              </div>
            )}
          </div>
        </div>

        {/* දකුණු පැත්ත: Form Inputs */}
        <div className="form-section animate-fade-in">
          <div className="request-card">
            <h2 className="form-title">New Request</h2>
            <p className="form-subtitle">අපද්‍රව්‍ය එකතු කිරීමට අවශ්‍ය තොරතුරු සහ ස්ථානය ලබා දෙන්න</p>

            <form onSubmit={handleSubmit} className="modern-form">
              <div className="input-group">
                <label>Waste Type (අපද්‍රව්‍ය වර්ගය)</label>
                <select 
                  value={wasteType} 
                  onChange={(e) => setWasteType(e.target.value)} 
                  className="modern-input"
                >
                  <option value="Plastic">Plastic</option>
                  <option value="E-waste">E-waste</option>
                  <option value="Glass">Glass</option>
                  <option value="Hazardous">Hazardous</option>
                </select>
              </div>

              {/* Location display box */}
              <div className="location-info-box">
                <span className="loc-icon">📍</span>
                <div>
                  <p className="loc-label">Selected Location</p>
                  <p className="loc-coords">
                    {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "සිතියම මත ස්ථානයක් තෝරන්න"}
                  </p>
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-request-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving to Cloud..." : "Submit Collection Request"}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default RequestForm;