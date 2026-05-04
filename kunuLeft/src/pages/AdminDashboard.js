import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { db } from '../firebase'; 
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from 'firebase/firestore';
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
    });

    return () => unsubscribe();
  }, []);

  // 2. Update Employee (Firestore)
  const assignEmployee = async (id) => {
    const empName = prompt("සේවකයාගේ නම (Employee Name):");
    if (empName) {
      try {
        const docRef = doc(db, 'requests', id);
        await updateDoc(docRef, { 
          employee: empName, 
          status: 'Assigned' 
        });
      } catch (err) {
        alert("Error assigning employee");
      }
    }
  };

  // 3. Mark as Collected (Firestore)
  const markAsCollected = async (id) => {
    try {
      const docRef = doc(db, 'requests', id);
      await updateDoc(docRef, { 
        status: 'Completed' 
      });
    } catch (err) {
      alert("Error updating status");
    }
  };

  // PDF Generation Logic
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
    doc.text(`Receipt ID: #${req.id}`, 20, 80);
    doc.text(`Customer Name: ${req.userName || req.user}`, 20, 100);
    doc.text(`Waste Type: ${req.wasteType || req.type}`, 20, 110);
    doc.text(`Status: SUCCESSFULLY COLLECTED`, 20, 130);
    doc.save(`Receipt_${req.id}.pdf`);
  };

  // Chart Data Logic
  const chartData = useMemo(() => {
    const counts = requests.reduce((acc, req) => {
      const type = req.wasteType || req.type || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [requests]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  if (loading) return <div className="loading-spinner">Loading Database...</div>;

  return (
    <div className="admin-page-container">
      <div className="modern-admin-card">
        <h2 style={{ color: '#065f46', textAlign: 'center', marginBottom: '30px' }}>
          Admin Management & Analytics
        </h2>

        {/* Analytics Section */}
        <div className="charts-grid">
          <div className="chart-box">
            <h4 style={{ textAlign: 'center', color: '#64748b', marginBottom: '15px' }}>Waste Distribution</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-box">
            <h4 style={{ textAlign: 'center', color: '#64748b', marginBottom: '15px' }}>Contribution Overview</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={60}>
                  {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ overflowX: 'auto', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Type</th>
                <th>Employee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id}>
                  <td>#{req.id.substring(0, 5)}</td>
                  <td style={{ fontWeight: '600' }}>{req.userName || req.user}</td>
                  <td><span className="status-pill pending" style={{fontSize: '11px'}}>{req.wasteType || req.type}</span></td>
                  <td style={{ color: !req.employee || req.employee === 'Not Assigned' ? '#ef4444' : '#334155' }}>
                    {req.employee || 'Not Assigned'}
                  </td>
                  <td>
                    <span style={{ color: req.status === 'Completed' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                      ● {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'pending' || req.status === 'Pending' ? (
                      <button className="btn-premium btn-assign" onClick={() => assignEmployee(req.id)}>Assign</button>
                    ) : null}
                    
                    {req.status === 'Assigned' && (
                      <button className="btn-premium btn-collect" onClick={() => markAsCollected(req.id)}>Collect</button>
                    )}
                    
                    {req.status === 'Completed' && (
                      <button className="btn-premium btn-receipt" onClick={() => downloadReceipt(req)}>Receipt</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && <p style={{textAlign: 'center', padding: '20px'}}>No requests found in database.</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;