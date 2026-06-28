import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import "../App.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => { if (coords) { map.setView([coords.lat, coords.lng], 13); } }, [coords, map]);
  return null;
}

function CollectorDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collector, setCollector] = useState(null);
  const [collectorName, setCollectorName] = useState("Collector");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCollector(user);
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().name) {
            setCollectorName(userDoc.data().name);
          } else {
            setCollectorName(user.displayName || "Collector");
          }
        } catch (err) { setCollectorName(user.displayName || "Collector"); }

        const q = query(collection(db, "requests"), where("collectorId", "==", user.uid));
        const unsubJobs = onSnapshot(q, (snapshot) => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
          setJobs(docs);
          if(docs.length > 0 &&!selectedJob) setSelectedJob(docs[0]);
          setLoading(false);
        }, (error) => { console.error("Firebase Error:", error); setLoading(false); });
        return () => unsubJobs();
      } else { navigate('/login', { replace: true }); }
    });
    return () => unsubAuth();
  }, [navigate, selectedJob]);

  const updateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "requests", id), { status: newStatus });
      alert(`Status updated to ${newStatus}`);
    }
    catch (err) { console.error(err); alert("Error updating status"); }
  };

  //Accept / Reject Functions 
  const acceptJob = async (id) => {
    try {
      await updateDoc(doc(db, "requests", id), { status: "Accepted" });
      alert("Job Accepted. You can now Start.");
    } catch (err) { console.error(err); alert("Error accepting job"); }
  };

  const rejectJob = async (id) => {
    if(window.confirm("Are you sure you want to reject this job?")){
      try {
        await updateDoc(doc(db, "requests", id), {
          status: "Assigned", 
          collectorId: null,
          collectorName: null
        });
        alert("Job Rejected.");
      } catch (err) { console.error(err); alert("Error rejecting job"); }
    }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/login'); };
  const getStatus = (s) => (s || "Pending").toLowerCase().trim();

  const assigned = jobs.filter(j => getStatus(j.status) === "assigned").length;
  const accepted = jobs.filter(j => getStatus(j.status) === "accepted").length; 
  const onWay = jobs.filter(j => getStatus(j.status) === "on the way").length;
  const arrived = jobs.filter(j => getStatus(j.status) === "arrived").length;
  const completed = jobs.filter(j => getStatus(j.status) === "completed").length;
  const statusData = [
    { name: "Assigned", value: assigned },
    { name: "Accepted", value: accepted }, 
    { name: "On Way", value: onWay },
    { name: "Arrived", value: arrived },
    { name: "Completed", value: completed }
  ];

  if (loading) return <div className="loading-spinner">Loading Your Jobs...</div>;

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="welcome-banner">
        <h1 className="dash-welcome-text">Hello, <span>{collectorName}</span> 🚛</h1>
        <p className="dash-subtitle">Your assigned waste collection jobs for today.</p>
      </div>

      <section className="stats-grid">
        <div className="stat-card glass-card"><h2>{assigned}</h2><p>Assigned</p></div>
        <div className="stat-card glass-card"><h2>{accepted}</h2><p>Accepted</p></div> {/* <-- Add */}
        <div className="stat-card glass-card"><h2>{onWay}</h2><p>On The Way</p></div>
        <div className="stat-card glass-card"><h2>{arrived}</h2><p>Arrived</p></div>
        <div className="stat-card glass-card"><h2>{completed}</h2><p>Completed</p></div>
      </section>

      <div className="dash-grid-layout">
        <div className="dash-glass-card map-holder">
          <h2 className="dash-section-title">📍 Job Locations</h2>
          <div className="map-wrapper" style={{ height: "400px", borderRadius: "15px", overflow: "hidden" }}>
            <MapContainer center={[7.8731, 80.7718]} zoom={8} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {selectedJob?.location && <ChangeMapView coords={selectedJob.location} />}
              {jobs.map(job => job.location && (
                <Marker key={job.id} position={[job.location.lat, job.location.lng]} eventHandlers={{ click: () => setSelectedJob(job) }}>
                  <Popup>{job.userName || job.user} - {job.wasteType || job.type} - {job.status}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="dash-glass-card form-holder">
          <h2 className="dash-section-title">📋 Current Job</h2>
          {selectedJob? (
            <div className="job-details">
              <div className="input-group"><label>Customer</label><p>{selectedJob.userName || selectedJob.user || "Anonymous"}</p></div>
              <div className="input-group"><label>Waste Type</label><p>{selectedJob.wasteType || selectedJob.type || "General"}</p></div>
              <div className="input-group"><label>Status</label><p><span className={`status-pill status-${getStatus(selectedJob.status).replace(" ", "-")}`}>{selectedJob.status || "Pending"}</span></p></div>
              <div className="input-group"><label>Location</label><p>{selectedJob.location? `${selectedJob.location.lat.toFixed(4)}, ${selectedJob.location.lng.toFixed(4)}` : "No Location"}</p></div>

              {/* ===== NEW: BUTTON FLOW ===== */}
              <div className="modal-actions" style={{marginTop: '20px'}}>
                {getStatus(selectedJob.status) === "assigned" && (
                  <>
                    <button className="btn-premium btn-receipt" onClick={() => acceptJob(selectedJob.id)}>✅ Accept</button>
                    <button className="btn-premium btn-cancel" onClick={() => rejectJob(selectedJob.id)}>❌ Reject</button>
                  </>
                )}
                {getStatus(selectedJob.status) === "accepted" && (
                  <button className="btn-premium btn-assign" onClick={() => updateStatus(selectedJob.id, "On the Way")}>🚚 Start - On the Way</button>
                )}
                {getStatus(selectedJob.status) === "on the way" && (
                  <>
                    <button className="btn-premium btn-collect" onClick={() => window.open(`https://maps.google.com?q=${selectedJob.location.lat},${selectedJob.location.lng}`)}>📍 Navigate</button>
                    <button className="btn-premium btn-assign" onClick={() => updateStatus(selectedJob.id, "Arrived")}>📍 Arrived</button>
                  </>
                )}
                {getStatus(selectedJob.status) === "arrived" && (
                  <button className="btn-premium btn-receipt" onClick={() => updateStatus(selectedJob.id, "Completed")}>✅ Complete Collection</button>
                )}
                {getStatus(selectedJob.status) === "completed" && (
                  <p style={{color: 'var(--eco-mint)', fontWeight: '700'}}>Job Completed</p>
                )}
              </div>
            </div>
          ) : (<p>No job selected. Click a marker on the map.</p>)}

          <hr style={{margin: '30px 0', border: 'none', borderTop: '1px solid rgba(15, 23, 42, 0.08)'}}/>
          <h3 className="dash-section-title" style={{fontSize: '16px'}}>Analytics</h3>
          <ResponsiveContainer width="100%" height={150}><BarChart data={statusData}><XAxis dataKey="name" fontSize={10} /><YAxis allowDecimals={false} fontSize={10} /><Tooltip /><Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CollectorDashboard;