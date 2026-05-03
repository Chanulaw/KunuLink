import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf'; 
import '../App.css';

function AdminDashboard() {
  const [requests, setRequests] = useState([
    { id: 101, user: 'Chanula', type: 'E-waste', status: 'Pending', employee: 'Not Assigned', date: '2026-04-20' },
    { id: 102, user: 'Kethmi', type: 'Plastic', status: 'Completed', employee: 'Saman', date: '2026-04-21' },
    { id: 103, user: 'Nimna', type: 'Plastic', status: 'Pending', employee: 'Not Assigned', date: '2026-04-22' },
    { id: 104, user: 'Amila', type: 'Glass', status: 'Assigned', employee: 'Nimal', date: '2026-04-23' },
  ]);

  // PDF Generation Logic (එලෙසම පවතී)
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
    doc.text(`Receipt ID: #R-2026-${req.id}`, 20, 80);
    doc.text(`Customer Name: ${req.user}`, 20, 100);
    doc.text(`Status: SUCCESSFULLY COLLECTED`, 20, 130);
    doc.save(`Receipt_${req.id}.pdf`);
  };

  const assignEmployee = (id) => {
    const empName = prompt("සේවකයාගේ නම:");
    if (empName) setRequests(requests.map(req => req.id === id ? { ...req, employee: empName, status: 'Assigned' } : req));
  };

  const markAsCollected = (id) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: 'Completed' } : req));
  };

  const chartData = useMemo(() => {
    const counts = requests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [requests]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

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
                  <td>#{req.id}</td>
                  <td style={{ fontWeight: '600' }}>{req.user}</td>
                  <td><span className="status-pill pending" style={{fontSize: '11px'}}>{req.type}</span></td>
                  <td style={{ color: req.employee === 'Not Assigned' ? '#ef4444' : '#334155' }}>{req.employee}</td>
                  <td>
                    <span style={{ color: req.status === 'Completed' ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                      ● {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' && (
                      <button className="btn-premium btn-assign" onClick={() => assignEmployee(req.id)}>Assign</button>
                    )}
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
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;