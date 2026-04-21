import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Marker Icon එක නිවැරදිව පෙන්වීමට සැකසීම
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map එක පාලනය කරන අභ්‍යන්තර Component එක
function MapController({ setPosition }) {
  const map = useMap();

  // පද්ධතියට පිවිසෙන විටම Location එක ලබා ගැනීමට උත්සාහ කිරීම
  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15); // Zoom level 15 කට location එකට යනවා
    });
  }, [map, setPosition]);

  // වෙනත් තැනක් ක්ලික් කළහොත් Marker එක එතැනට ගෙනයාම
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !photo) {
      alert("කරුණාකර සිතියම මත ස්ථානය සහ ඡායාරූපයක් ලබා දෙන්න.");
      return;
    }
    alert(`සාර්ථකයි! \nස්ථානය: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', color: '#2e7d32' }}>අපද්‍රව්‍ය එකතු කිරීමේ ඉල්ලීම</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>අපද්‍රව්‍ය වර්ගය:</label>
          <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
            <option>Plastic</option>
            <option>E-waste</option>
            <option>Glass</option>
            <option>Hazardous</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>ඡායාරූපය (Photo):</label>
          <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} style={{ width: '100%', padding: '10px' }} />
        </div>

        <p style={{ fontSize: '14px', color: '#666' }}>* සිතියම මත ඔබ සිටින ස්ථානය නිවැරදිව සලකුණු වී ඇත්දැයි බලන්න. (නැතිනම් ක්ලික් කර සලකුණු කරන්න)</p>
        
        <div style={{ height: '350px', width: '100%', marginBottom: '20px', border: '2px solid #2e7d32', borderRadius: '8px' }}>
          <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            <MapController setPosition={setPosition} />
            
            {position && <Marker position={position}></Marker>}
          </MapContainer>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
          Request Pickup
        </button>
      </form>
    </div>
  );
}

export default RequestForm;