import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, updateDoc, query, orderBy, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf'; 
import '../App.css';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const assignCollector = async (requestId) => {
  try {
    // 1. get all collectors
    const q = query(collection(db, "collectors"));
    const snapshot = await getDocs(q);

    const collectors = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    if (collectors.length === 0) {
      alert("No collectors available");
      return;
    }

    // 2. find least busy collector
    let selected = collectors[0];

    collectors.forEach((c) => {
      if ((c.activeJobs || 0) < (selected.activeJobs || 0)) {
        selected = c;
      }
    });

    // 3. assign request to collector
    await updateDoc(doc(db, "requests", requestId), {
      collectorName: selected.name,
      collectorId: selected.collectorId,
      status: "Assigned",
    });

    // 4. increase collector job count
    await updateDoc(doc(db, "collectors", selected.id), {
      activeJobs: (selected.activeJobs || 0) + 1,
    });

    alert(`Assigned to ${selected.name}`);
  } catch (err) {
    console.error(err);
    alert("Auto assign failed");
  }
};

  // 3. Update Status
  const updateStatus = async (id, status) => {
    try {
      const docRef = doc(db, "requests", id);
      await updateDoc(docRef, { status: status });
      alert(`Status updated to ${status}`);
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // 4. PDF Receipt Generation
  const downloadReceipt = (req) => {
    const doc = new jsPDF();
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('KUNULINK PORTAL', 20, 25);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('OFFICIAL WASTE COLLECTION RECEIPT', 20, 60);
    doc.setFontSize(12);
    doc.text(`Receipt ID: #${req.id.substring(0, 8)}`, 20, 80);
    doc.text(`Customer Name: ${req.userName || req.user || 'N/A'}`, 20, 100);
    doc.text(`Waste Type: ${req.wasteType || req.type || 'N/A'}`, 20, 110);
    doc.text(`Collector: ${req.collectorName || 'N/A'}`, 20, 120);
    doc.text(`Status: SUCCESSFULLY COLLECTED`, 20, 140);
    doc.text(`Date: ${formatTimestamp(req.createdAt)}`, 20, 150);
    doc.save(`Receipt_${req.id.substring(0, 8)}.pdf`);
  };

  // Helper Functions
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "-";
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString();
    return "-";
  };

  const formatLocation = (loc) => {
    if (!loc?.lat || !loc?.lng) return "No Location";
    return `${Number(loc.lat).toFixed(4)}, ${Number(loc.lng).toFixed(4)}`;
  };

  // Stats Counts
  const pending = requests.filter(r => !r.status || r.status === "Pending").length;
  const assigned = requests.filter(r => r.status === "Assigned").length;
  const onWay = requests.filter(r => r.status === "On the Way").length;
  const arrived = requests.filter(r => r.status === "Arrived").length;
  const completed = requests.filter(r => r.status === "Completed").length;

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
          <div className="stat-card">
            <h3>{pending}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card">
            <h3>{assigned}</h3>
            <p>Assigned</p>
          </div>
          <div className="stat-card">
            <h3>{onWay}</h3>
            <p>On the Way</p>
          </div>
          <div className="stat-card">
            <h3>{arrived}</h3>
            <p>Arrived</p>
          </div>
          <div className="stat-card">
            <h3>{completed}</h3>
            <p>Completed</p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="charts-grid">
          <div className="chart-box">
            <h4 style={{ textAlign: 'center', color: '#64748b', marginBottom: '15px' }}>Waste Distribution</h4>
            <ResponsiveContainer width="100%" height={220}>
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
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie 
                  data={chartData} 
                  dataKey="count" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={60}
                  label
                >
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Waste Type</th>
                <th>Collector</th>
                <th>User Location</th>
                <th>Status</th>
                <th>Action</th>
                <th>Collector Location</th>
                <th>Requested Time</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => {
                const currentStatus = req.status ? req.status.trim() : "Pending";

                const statusColor =
                  currentStatus === "Completed" ? "#10b981" :
                  currentStatus === "Arrived" ? "#16a34a" :
                  currentStatus === "On the Way" ? "#2563eb" :
                  currentStatus === "Assigned" ? "#0284c7" : "#f59e0b";

                return (
                  <tr key={req.id}>
                    <td>#{req.id.substring(0,5)}</td>
                    <td style={{fontWeight:"600"}}>
                      {req.userName || req.user || "Anonymous"}
                    </td>
                    <td>
                      <span className="status-pill">
                        {req.wasteType || req.type || "General"}
                      </span>
                    </td>
                    <td>{req.collectorName || "Not Assigned"}</td>
                    <td>{formatLocation(req.location)}</td>
                    <td>
                      <span style={{ fontWeight: "bold", color: statusColor }}>
                        ● {currentStatus}
                      </span>
                    </td>
                    <td>
                      {currentStatus === "Pending" && (
                        <button className="btn-premium btn-assign" onClick={() => assignCollector(req.id)}>
                          Assign
                        </button>
                      )}
                      {currentStatus === "Assigned" && (
                        <button className="btn-premium btn-collect" onClick={() => updateStatus(req.id,"On the Way")}>
                          On the Way
                        </button>
                      )}
                      {currentStatus === "On the Way" && (
                        <button className="btn-premium btn-collect" onClick={() => updateStatus(req.id,"Arrived")}>
                          Arrived
                        </button>
                      )}
                      {currentStatus === "Arrived" && (
                        <button className="btn-premium btn-collect" onClick={() => updateStatus(req.id,"Completed")}>
                          Collected
                        </button>
                      )}
                      {currentStatus === "Completed" && (
                        <button className="btn-premium btn-receipt" onClick={() => downloadReceipt(req)}>
                          Receipt
                        </button>
                      )}
                    </td>
                    <td>{formatLocation(req.collectorLocation)}</td>
                    <td>{formatTimestamp(req.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {requests.length === 0 && <p style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>No requests found in database.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;