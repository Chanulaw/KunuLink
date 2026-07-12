import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { db, auth } from '../firebase';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import jsPDF from 'jspdf';
import '../App.css';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollectorModal, setShowCollectorModal] = useState(false);
  const [assignModal, setAssignModal] = useState({ isOpen: false, reqId: null });
  const [collectors, setCollectors] = useState([]);
  const [search, setSearch] = useState("");
  
  const [collectorForm, setCollectorForm] = useState({
    name: "", email: "", phone: "", vehicle: "", area: "", password: ""
  });

  useEffect(() => {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRequests(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'collectors'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCollectors(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const assignSpecificCollector = async (collector) => {
    try {
      if (!assignModal.reqId) return;
      const reqId = assignModal.reqId;

      await updateDoc(doc(db, "requests", reqId), {
        collectorName: collector.name,
        collectorId: collector.id,
        collectorPhone: collector.phone || "",
        vehicle: collector.vehicle || "",
        status: "Assigned",
      });

      await updateDoc(doc(db, "collectors", collector.id), {
        activeJobs: (collector.activeJobs || 0) + 1
      });

      alert(`Assigned to ${collector.name}`);
      setAssignModal({ isOpen: false, reqId: null });
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const downloadReceipt = (req) => {
    const docPdf = new jsPDF();
    docPdf.setFillColor(16, 185, 129);
    docPdf.rect(0, 0, 210, 40, 'F');
    docPdf.setFontSize(22);
    docPdf.setTextColor(255, 255, 255);
    docPdf.text('KUNULINK PORTAL', 20, 25);
    docPdf.setFontSize(16);
    docPdf.setTextColor(0, 0, 0);
    docPdf.text('OFFICIAL WASTE COLLECTION RECEIPT', 20, 60);
    docPdf.setFontSize(12);
    docPdf.text(`Receipt ID: #${req.id}`, 20, 80);
    docPdf.text(`Customer Name: ${req.userName || 'N/A'}`, 20, 100);
    docPdf.text(`Waste Type: ${req.wasteType || 'N/A'}`, 20, 110);
    docPdf.text(`Collector: ${req.collectorName || 'N/A'}`, 20, 120);
    docPdf.text(`Status: SUCCESSFULLY COLLECTED`, 20, 130);
    docPdf.save(`Receipt_${req.id}.pdf`);
  };

  const saveCollector = async () => {
    try {
      if(!collectorForm.email ||!collectorForm.password ||!collectorForm.name){
        alert("Name, Email and Password required");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(auth, collectorForm.email, collectorForm.password);
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        name: collectorForm.name, email: collectorForm.email, role: "collector", createdAt: serverTimestamp(),
      });

      await setDoc(doc(db, "collectors", uid), {
        name: collectorForm.name, email: collectorForm.email, phone: collectorForm.phone, vehicle: collectorForm.vehicle,
        area: collectorForm.area, role: "collector", activeJobs: 0, createdAt: serverTimestamp(),
      });

      alert("Collector Added Successfully");
      setShowCollectorModal(false);
      setCollectorForm({ name: "", email: "", phone: "", vehicle: "", area: "", password: "" });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const getStatus = (s) => (s || "Pending").toLowerCase().trim();

  const pending = requests.filter(r => getStatus(r.status) === "pending").length;
  const assigned = requests.filter(r => getStatus(r.status) === "assigned").length;
  const accepted = requests.filter(r => getStatus(r.status) === "accepted").length;
  const onWay = requests.filter(r => getStatus(r.status) === "on the way").length;
  const arrived = requests.filter(r => getStatus(r.status) === "arrived").length;
  const completed = requests.filter(r => getStatus(r.status) === "completed").length;

  // CHART DATA
  const chartData = useMemo(() => {
    const counts = requests.reduce((acc, req) => {
      const type = req.wasteType || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [requests]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const filteredCollectors = collectors.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.area?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading-spinner">Loading Database...</div>;

  return (
    <div className="admin-page-container">
      <div className="modern-admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ color: '#065f46', textAlign: 'center', marginBottom: '30px' }}>
            Admin Management & Analytics
          </h2>
          <button onClick={() => setShowCollectorModal(true)} className="btn-premium btn-assign">
            + Add Collector
          </button>
        </div>

        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card"><h3>{pending}</h3><p>Pending</p></div>
          <div className="stat-card"><h3>{assigned}</h3><p>Assigned</p></div>
          <div className="stat-card"><h3>{accepted}</h3><p>Accepted</p></div>
          <div className="stat-card"><h3>{onWay}</h3><p>On the Way</p></div>
          <div className="stat-card"><h3>{arrived}</h3><p>Arrived</p></div>
          <div className="stat-card"><h3>{completed}</h3><p>Completed</p></div>
        </div>

        {/* CHARTS - ADDED BACK */}
        <div className="charts-grid">
          <div className="chart-box">
            <h4 style={{ textAlign: 'center', color: '#64748b', marginBottom: '15px' }}>Waste Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h4 style={{ textAlign: 'center', color: '#64748b', marginBottom: '15px' }}>Contribution Overview</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="main-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th><th>User</th><th>Waste Type</th><th>Collector</th>
                <th>Location</th><th>Status</th><th>Action</th>
                <th>Collector Location</th><th>Requested Time</th>
              </tr>
            </thead>
            <tbody>
            {requests.map(req => {
              const currentStatus = getStatus(req.status);
              const statusColor =
                currentStatus === "completed"? "#10b981" :
                currentStatus === "arrived"? "#16a34a" :
                currentStatus === "on the way"? "#2563eb" :
                currentStatus === "accepted"? "#059669" :
                currentStatus === "assigned"? "#0284c7" : "#f59e0b";

              return (
                <tr key={req.id}>
                  <td>#{req.id.substring(0,5)}</td>
                  <td style={{fontWeight:"600"}}>{req.userName || "Anonymous"}</td>
                  <td><span className="status-pill">{req.wasteType || "General"}</span></td>
                  <td>{req.collectorName || "Not Assigned"}</td>
                  <td>{req.location? `${req.location.lat.toFixed(4)}, ${req.location.lng.toFixed(4)}` : "No Location"}</td>
                  <td><span style={{ fontWeight: "bold", color: statusColor }}>● {req.status || "Pending"}</span></td>
                  <td>
                    {currentStatus === "pending" && (
                      <button className="btn-premium btn-assign" onClick={() => setAssignModal({ isOpen: true, reqId: req.id })}>
                        Assign
                      </button>
                    )}
                    {currentStatus === "completed" && (
                      <button className="btn-premium btn-receipt" onClick={() => downloadReceipt(req)}>
                        Receipt
                      </button>
                    )}
                    {["assigned","accepted","on the way","arrived"].includes(currentStatus) && (
                      <span style={{color: '#64748b', fontSize: '12px'}}>Waiting for Collector</span>
                    )}
                  </td>
                  <td>{req.collectorLocation? `${req.collectorLocation.lat.toFixed(4)}, ${req.collectorLocation.lng.toFixed(4)}` : "Not Sharing"}</td>
                  <td>{req.createdAt? new Date(req.createdAt.seconds*1000).toLocaleString() : "-"}</td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </div>

      {/* ADD COLLECTOR MODAL */}
      {showCollectorModal && (
        <div className="modal-overlay">
          <div className="modal-box pro-modal">
            <h2>➕ Add New Collector</h2><br/>
            <div className="form-grid-2col">
              <div className="input-group"><label>Full Name</label><input value={collectorForm.name} onChange={(e) => setCollectorForm({...collectorForm, name: e.target.value})}/></div>
              <div className="input-group"><label>Email</label><input type="email" value={collectorForm.email} onChange={(e) => setCollectorForm({...collectorForm, email: e.target.value})}/></div>
              <div className="input-group"><label>Password</label><input type="password" value={collectorForm.password} onChange={(e) => setCollectorForm({...collectorForm, password: e.target.value})}/></div>
              <div className="input-group"><label>Phone</label><input value={collectorForm.phone} onChange={(e) => setCollectorForm({...collectorForm, phone: e.target.value})}/></div>
              <div className="input-group"><label>Vehicle</label><input value={collectorForm.vehicle} onChange={(e) => setCollectorForm({...collectorForm, vehicle: e.target.value})}/></div>
              <div className="input-group"><label>Area</label><input value={collectorForm.area} onChange={(e) => setCollectorForm({...collectorForm, area: e.target.value})}/></div>
            </div>
            <div className="modal-actions">
              <button className="btn-premium btn-cancel" onClick={() => setShowCollectorModal(false)}>Cancel</button>
              <button className="btn-premium btn-assign" onClick={saveCollector}>Save Collector</button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN COLLECTOR MODAL - FIXED */}
      {assignModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-box pro-modal assign-modal">
            <h2>👤 Assign a Collector</h2>
            <p style={{color: '#64748b', marginBottom: '15px'}}>Select a collector for Request #{assignModal.reqId.substring(0,5)}</p>
            
            <input 
              type="text"
              placeholder="Search by Name or Area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="modal-search"
            />

            <div className="assign-table-wrapper">
              {filteredCollectors.length === 0 ? (
                <p>No collectors found.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>NAME</th><th>EMAIL</th><th>PHONE</th><th>AREA</th><th>VEHICLE</th><th>ACTIVE JOBS</th><th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollectors.map(c => {
                      const isFull = (c.activeJobs || 0) >= 3;
                      return (
                        <tr key={c.id} className={isFull ? 'full-row' : ''}>
                          <td style={{fontWeight: 'bold'}}>{c.name}</td>
                          <td>{c.email}</td>
                          <td>{c.phone || 'N/A'}</td>
                          <td>{c.area || 'N/A'}</td>
                          <td>{c.vehicle || 'N/A'}</td>
                          <td>
                            <span className="status-pill" style={{
                              background: isFull ? '#fee2e2' : '#eff6ff',
                              color: isFull ? '#ef4444' : '#2563eb'
                            }}>
                              {c.activeJobs || 0}
                            </span>
                          </td>
                          <td>
                            <button 
                              className="btn-premium btn-assign" 
                              disabled={isFull}
                              onClick={() => assignSpecificCollector(c)}
                            >
                              {isFull ? 'FULL' : 'SELECT'}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-actions" style={{marginTop: '20px'}}>
              <button className="btn-premium btn-cancel" onClick={() => {setAssignModal({ isOpen: false, reqId: null }); setSearch("");}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;