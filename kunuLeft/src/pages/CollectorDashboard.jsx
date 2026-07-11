import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { useNavigate } from "react-router-dom";
import "../App.css";

// Leaflet Icon Fix
delete L.Icon.Default.prototype._getIconUrl;

// Custom Icons
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize:[35,35],
  iconAnchor: [17, 35]
});

const collectorIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3202/3202926.png",
  iconSize:[40,40],
  iconAnchor: [20, 40]
});

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 14);
    }
  }, [coords, map]);
  return null;
}

function CollectorDashboard() {
  const navigate = useNavigate();
  const [collector, setCollector] = useState(null);
  const [collectorName, setCollectorName] = useState("Collector");
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [collectorLocation, setCollectorLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // AUTH + LOAD ALL PENDING JOBS TOO
  // ===============================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      setCollector(user);
      const userSnap = await getDoc(doc(db, "users", user.uid));

      if (!userSnap.exists() || userSnap.data().role!== "collector") {
        alert("Access denied");
        navigate("/login");
        return;
      }
      setCollectorName(userSnap.data().name || "Collector");

      // FIX: Admin assign කරලා නැතුවත් pending jobs පේන්න
      const q1 = query(collection(db, "requests"), where("collectorId", "==", user.uid));
      const q2 = query(collection(db, "requests"), where("status", "==", "Pending"));

      const unsub1 = onSnapshot(q1, (snapshot) => {
        const myJobs = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
        setJobs(prev => {
          const otherJobs = prev.filter(j =>!j.collectorId || j.collectorId === user.uid);
          const all = [...myJobs,...otherJobs.filter(j =>!myJobs.find(m => m.id === j.id))];
          if (all.length > 0 &&!selectedJob) setSelectedJob(all[0]);
          return all;
        });
        setLoading(false);
      });

      const unsub2 = onSnapshot(q2, (snapshot) => {
        const pendingJobs = snapshot.docs.map(doc => ({ id: doc.id,...doc.data() }));
        setJobs(prev => {
          const myJobs = prev.filter(j => j.collectorId === user.uid);
          const all = [...myJobs,...pendingJobs.filter(j =>!myJobs.find(m => m.id === j.id))];
          if (all.length > 0 &&!selectedJob) setSelectedJob(all[0]);
          return all;
        });
      });

      return () => { unsub1(); unsub2(); };
    });
    return () => unsubscribe();
  }, [navigate, selectedJob]);

  // LIVE LOCATION
  useEffect(() => {
    if (!collector) return;
    if (!navigator.geolocation) return;

    const watch = navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCollectorLocation({ lat, lng });

        await setDoc(
          doc(db, "collectors", collector.uid),
          {
            currentLocation: { lat, lng },
            isOnline: true,
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      },
      (err) => { console.log(err); },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watch);
      setDoc(doc(db, "collectors", collector.uid), {
        isOnline: false,
        updatedAt: serverTimestamp()
      }, { merge: true });
    };
  }, [collector]);

  const getStatus = (status) => {
    return (status || "Pending").toLowerCase().replace(/_/g, " ").trim();
  };

  const updateStatus = async (jobId, status) => {
    try {
      await updateDoc(doc(db, "requests", jobId), { status, updatedAt: serverTimestamp() });
      setJobs(prev => prev.map(job => job.id === jobId? {...job, status } : job));
      if (selectedJob?.id === jobId) setSelectedJob(prev => ({...prev, status }));
      alert("Status Updated");
    } catch (err) { console.log(err); alert("Update Failed"); }
  };

  const acceptJob = async (jobId) => {
    try {
      await updateDoc(doc(db, "requests", jobId), {
        status: "Accepted",
        collectorId: collector.uid,
        collectorName: collectorName,
        acceptedAt: serverTimestamp()
      });
      setJobs(prev => prev.map(job => job.id === jobId? {...job, status: "Accepted", collectorId: collector.uid } : job));
      if (selectedJob?.id === jobId) setSelectedJob(prev => ({...prev, status: "Accepted", collectorId: collector.uid }));
    } catch (err) { console.log(err); alert("Accept Failed"); }
  };

  const rejectJob = async (jobId) => {
    const ok = window.confirm("Reject this job?");
    if (!ok) return;
    try {
      await updateDoc(doc(db, "requests", jobId), {
        status: "Pending",
        collectorId: null,
        collectorName: null,
        rejectedAt: serverTimestamp()
      });
      alert("Job Rejected");
    } catch (err) { console.log(err); }
  };

  const completeJob = async (jobId) => {
    try {
      await updateDoc(doc(db, "requests", jobId), {
        status: "Completed",
        completedAt: serverTimestamp()
      });
      const collectorRef = doc(db, "collectors", collector.uid);
      const snap = await getDoc(collectorRef);
      if (snap.exists()) {
        const current = snap.data().activeJobs || 0;
        await updateDoc(collectorRef, { activeJobs: current > 0? current - 1 : 0 });
      }
      alert("Collection Completed");
    } catch (err) { console.log(err); }
  };

  const assigned = jobs.filter(j => getStatus(j.status) === "assigned").length;
  const accepted = jobs.filter(j => getStatus(j.status) === "accepted").length;
  const onWay = jobs.filter(j => getStatus(j.status) === "on the way").length;
  const arrived = jobs.filter(j => getStatus(j.status) === "arrived").length;
  const completed = jobs.filter(j => getStatus(j.status) === "completed").length;
  const chartData = [
    { name: "Assigned", value: assigned },
    { name: "Accepted", value: accepted },
    { name: "On Way", value: onWay },
    { name: "Arrived", value: arrived },
    { name: "Completed", value: completed }
  ];

  if (loading) return <div className="loading-spinner">Loading Collector Dashboard...</div>;

  return (
    <div className="dashboard-container animate-fade-in">
      <div className="welcome-banner">
        <div>
          <h1 className="dash-welcome-text">Hello, <span>{collectorName}</span> 🚛</h1>
          <p className="dash-subtitle">Your assigned waste collection jobs</p>
        </div>
      </div>

      <section className="stats-grid">
        <div className="stat-card glass-card"><h2>{assigned}</h2><p>Assigned</p></div>
        <div className="stat-card glass-card"><h2>{accepted}</h2><p>Accepted</p></div>
        <div className="stat-card glass-card"><h2>{onWay}</h2><p>On The Way</p></div>
        <div className="stat-card glass-card"><h2>{arrived}</h2><p>Arrived</p></div>
        <div className="stat-card glass-card"><h2>{completed}</h2><p>Completed</p></div>
      </section>

      <div className="dash-grid-layout">
        {/* MAP SECTION */}
        <div className="dash-glass-card map-holder">
          <h2 className="dash-section-title">📍 Collection Map</h2>
          <div className="map-wrapper" style={{ height:"450px", borderRadius:"20px", overflow:"hidden" }}>
            <MapContainer center={[7.8731,80.7718]} zoom={8} style={{ width:"100%", height:"100%" }}>
              <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {selectedJob?.location && <ChangeMapView coords={selectedJob.location}/>}

              {/* USER LOCATION */}
              {jobs.map(job => (
                job.location && (
                  <Marker
                    key={job.id}
                    position={[job.location.lat, job.location.lng]}
                    icon={userIcon}
                    eventHandlers={{ click:() => setSelectedJob(job) }}
                  >
                    <Popup>
                      <h4>👤 Citizen Location</h4>
                      Name: {job.userName || "Anonymous"} <br/>
                      Waste: {job.wasteType} <br/>
                      Status: {job.status} <br/>
                      {job.collectorId === collector.uid && <b style={{color:"green"}}>Assigned to You</b>}
                    </Popup>
                  </Marker>
                )
              ))}

              {/* COLLECTOR LIVE LOCATION */}
              {collectorLocation && (
                <Marker
                  position={[collectorLocation.lat, collectorLocation.lng]}
                  icon={collectorIcon}
                >
                  <Popup>
                    🚛 Collector Current Location <br/>
                    Lat: {collectorLocation.lat.toFixed(5)} <br/>
                    Lng: {collectorLocation.lng.toFixed(5)}
                  </Popup>
                </Marker>
              )}

              {/* ROUTE */}
              {collectorLocation && selectedJob?.location && (
                <Polyline
                  positions={[
                    [collectorLocation.lat, collectorLocation.lng],
                    [selectedJob.location.lat, selectedJob.location.lng]
                  ]}
                  pathOptions={{ color: "#059669", weight: 4, dashArray: "10, 10" }}
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* CURRENT JOB */}
        <div className="dash-glass-card form-holder">
          <h2 className="dash-section-title">📋 Current Job</h2>
          {selectedJob? (
            <div className="job-details">
              <div className="input-group"><label>Citizen</label><p>{selectedJob.userName || "Anonymous"}</p></div>
              <div className="input-group"><label>Waste Type</label><p>{selectedJob.wasteType || "General"}</p></div>
              <div className="input-group"><label>Status</label><p><span className="status-pill">{selectedJob.status}</span></p></div>
              <div className="input-group">
                <label>Location</label>
                <p>{selectedJob.location? `${selectedJob.location.lat.toFixed(5)}, ${selectedJob.location.lng.toFixed(5)}` : "No Location"}</p>
              </div>

              <div className="modal-actions">
                {getStatus(selectedJob.status)==="pending" && (
                  <button className="btn-premium btn-assign" onClick={() => acceptJob(selectedJob.id)}>✅ Accept Job</button>
                )}
                {getStatus(selectedJob.status)==="assigned" && (
                  <>
                    <button className="btn-premium btn-assign" onClick={() => acceptJob(selectedJob.id)}>✅ Accept</button>
                    <button className="btn-premium btn-cancel" onClick={() => rejectJob(selectedJob.id)}>❌ Reject</button>
                  </>
                )}
                {getStatus(selectedJob.status)==="accepted" && (
                  <button className="btn-premium btn-assign" onClick={() => updateStatus(selectedJob.id, "On the Way")}>🚚 Start Collection</button>
                )}
                {getStatus(selectedJob.status)==="on the way" && (
                  <>
                    <button className="btn-premium btn-collect" onClick={() => window.open(`https://maps.google.com?q=${selectedJob.location.lat},${selectedJob.location.lng}`)}>📍 Navigate</button>
                    <button className="btn-premium btn-assign" onClick={() => updateStatus(selectedJob.id, "Arrived")}>📍 Arrived</button>
                  </>
                )}
                {getStatus(selectedJob.status)==="arrived" && (
                  <button className="btn-premium btn-assign" onClick={() => completeJob(selectedJob.id)}>✅ Complete Collection</button>
                )}
                {getStatus(selectedJob.status)==="completed" && <h3 style={{ color:"#059669" }}>✔ Job Completed</h3>}
              </div>
            </div>
          ) : <p>Select job from map</p>}

          <hr/>
          <h3 className="dash-section-title">Analytics</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name"/><YAxis/><Tooltip/>
              <Bar dataKey="value" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default CollectorDashboard;