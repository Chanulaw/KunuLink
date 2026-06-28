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
  getDocs,
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

  // Collector Form State
  const [collectorForm, setCollectorForm] = useState({
    name: "", email: "", phone: "", vehicle: "", area: "", password: ""
  });

  // 1. Real-time Firebase Listener
  useEffect(() => {
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
       ...doc.data()
      }));
      setRequests(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Assign Collector
  const assignEmployee = async (id) => {
    try {
      const q = query(collection(db, "collectors"));
      const snapshot = await getDocs(q);
      const collectors = snapshot.docs.map((d) => ({ id: d.id,...d.data() }));

      if (collectors.length === 0) {
        alert("No collectors available. Please Add Collector first.");
        return;
      }

      
      let selected = collectors.reduce((min, c) => (c.activeJobs || 0) < (min.activeJobs || 0)? c : min, collectors[0]);

      // 1. Request update
      await updateDoc(doc(db, "requests", id), {
        collectorName: selected.name,
        collectorId: selected.id, // <-- Auth UID eka
        status: "Assigned",
      });

      // 2. FIX: Collector activeJobs 
      await updateDoc(doc(db, "collectors", selected.id), {
        activeJobs: (selected.activeJobs || 0) + 1
      });

      alert(`Assigned to ${selected.name}`);
    } catch (error) {
      console.error(error);
      alert("Error assigning collector");
    }
  };

  // 3. Update Status
  const updateStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "requests", id), { status: status });
      alert(`Status updated to ${status}`);
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // 4. PDF Receipt
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
    docPdf.text(`Customer Name: ${req.userName || req.user || 'N/A'}`, 20, 100);
    docPdf.text(`Waste Type: ${req.wasteType || req.type || 'N/A'}`, 20, 110);
    docPdf.text(`Collector: ${req.collectorName || 'N/A'}`, 20, 120);
    docPdf.text(`Status: SUCCESSFULLY COLLECTED`, 20, 130);
    docPdf.save(`Receipt_${req.id}.pdf`);
  };

  // 5. ADD COLLECTOR FUNCTION 
  const saveCollector = async () => {
    try {
      if(!collectorForm.email ||!collectorForm.password ||!collectorForm.name){
        alert("Name, Email and Password required");
        return;
      }
      // 1. Firebase Auth eke account hadanawa
      const userCredential = await createUserWithEmailAndPassword(auth, collectorForm.email, collectorForm.password);
      const uid = userCredential.user.uid;

      // 2. 'users' collection ekata role
      await setDoc(doc(db, "users", uid), {
        name: collectorForm.name,
        email: collectorForm.email,
        role: "collector",
        createdAt: serverTimestamp(),
      });

      // 3. 'collectors' collection ekata save 
      await setDoc(doc(db, "collectors", uid), {
        name: collectorForm.name,
        email: collectorForm.email,
        phone: collectorForm.phone,
        vehicle: collectorForm.vehicle,
        area: collectorForm.area,
        role: "collector",
        activeJobs: 0, 
        createdAt: serverTimestamp(),
      });

      alert("Collector Added Successfully");
      setShowCollectorModal(false);
      setCollectorForm({ name: "", email: "", phone: "", vehicle: "", area: "", password: "" });
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Helper: Status lowercase
  const getStatus = (s) => (s || "Pending").toLowerCase().trim();

  // Stats Counts
  const pending = requests.filter(r => getStatus(r.status) === "pending").length;
  const assigned = requests.filter(r => getStatus(r.status) === "assigned").length;
  const onWay = requests.filter(r => getStatus(r.status) === "on the way").length;
  const arrived = requests.filter(r => getStatus(r.status) === "arrived").length;
  const completed = requests.filter(r => getStatus(r.status) === "completed").length;

  // Chart Data
  const chartData = useMemo(() => {
    const counts = requests.reduce((acc, req) => {
      const type = req.wasteType || req.type || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [requests]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) return <div className="loading-spinner">Loading Database...</div>;

  return (
    <div className="admin-page-container">
      <div className="modern-admin-card">
        <h2 style={{ color: '#065f46', textAlign: 'center', marginBottom: '30px' }}>
          Admin Management & Analytics
        </h2>

        

        <div className="stats-grid">
          <div className="stat-card"><h3>{pending}</h3><p>Pending</p></div>
          <div className="stat-card"><h3>{assigned}</h3><p>Assigned</p></div>
          <div className="stat-card"><h3>{onWay}</h3><p>On the Way</p></div>
          <div className="stat-card"><h3>{arrived}</h3><p>Arrived</p></div>
          <div className="stat-card"><h3>{completed}</h3><p>Completed</p></div>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-box">
            <h4 style={{ textAlign: 'center', color: '#64748b', marginBottom: '15px' }}>Waste Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h4 style={{ textAlign: 'center', color: '#64748b', marginBottom: '15px' }}>Contribution Overview</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                  {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
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
                currentStatus === "assigned"? "#0284c7" : "#f59e0b";

              return (
                <tr key={req.id}>
                  <td>#{req.id.substring(0,5)}</td>
                  <td style={{fontWeight:"600"}}>{req.userName || req.user || "Anonymous"}</td>
                  <td><span className="status-pill">{req.wasteType || req.type || "General"}</span></td>
                  <td>{req.collectorName || "Not Assigned"}</td>
                  <td>{req.location? `${req.location.lat.toFixed(4)}, ${req.location.lng.toFixed(4)}` : "No Location"}</td>
                  <td><span style={{ fontWeight: "bold", color: statusColor }}>● {req.status || "Pending"}</span></td>
                  <td>
                    {currentStatus === "pending" && (<button className="btn-premium btn-assign" onClick={() => assignEmployee(req.id)}>Assign</button>)}
                    {currentStatus === "assigned" && (<button className="btn-premium btn-collect" onClick={() => updateStatus(req.id,"On the Way")}>On the Way</button>)}
                    {currentStatus === "on the way" && (<button className="btn-premium btn-collect" onClick={() => updateStatus(req.id,"Arrived")}>Arrived</button>)}
                    {currentStatus === "arrived" && (<button className="btn-premium btn-collect" onClick={() => updateStatus(req.id,"Completed")}>Collected</button>)}
                    {currentStatus === "completed" && (<button className="btn-premium btn-receipt" onClick={() => downloadReceipt(req)}>Receipt</button>)}
                  </td>
                  <td>{req.collectorLocation? `${req.collectorLocation.lat.toFixed(4)}, ${req.collectorLocation.lng.toFixed(4)}` : "Not Sharing"}</td>
                  <td>{req.createdAt? new Date(req.createdAt.seconds*1000).toLocaleString() : "-"}</td>
                </tr>
              );
            })}
          </tbody>
          </table>
          {requests.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>No requests found in database.</p>}
        </div>
      </div>

      {/* PRO GLASS MODAL */}
      {showCollectorModal && (
        <div className="modal-overlay">
          <div className="modal-box pro-modal">
            <h2>➕ Add New Collector</h2><br/>
            <div className="form-grid-2col">
              <div className="input-group"><label>Full Name</label><input placeholder="John Doe" value={collectorForm.name} onChange={(e) => setCollectorForm({...collectorForm, name: e.target.value})}/></div>
              <div className="input-group"><label>Email Address</label><input placeholder="email@example.com" type="email" value={collectorForm.email} onChange={(e) => setCollectorForm({...collectorForm, email: e.target.value})}/></div>
              <div className="input-group"><label>Password</label><input placeholder="Min 6 characters" type="password" value={collectorForm.password} onChange={(e) => setCollectorForm({...collectorForm, password: e.target.value})}/></div>
              <div className="input-group"><label>Phone Number</label><input placeholder="07x xxx xxxx" value={collectorForm.phone} onChange={(e) => setCollectorForm({...collectorForm, phone: e.target.value})}/></div>
              <div className="input-group"><label>Vehicle Number</label><input placeholder="CA-1234" value={collectorForm.vehicle} onChange={(e) => setCollectorForm({...collectorForm, vehicle: e.target.value})}/></div>
              <div className="input-group"><label>Assigned Area</label><input placeholder="Colombo 05" value={collectorForm.area} onChange={(e) => setCollectorForm({...collectorForm, area: e.target.value})}/></div>
            </div>
            <div className="modal-actions">
              <button className="btn-premium btn-cancel" onClick={() => setShowCollectorModal(false)}>Cancel</button>
              <button className="btn-premium btn-assign" onClick={saveCollector}>Save Collector</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;