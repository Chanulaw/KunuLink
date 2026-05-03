import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import jsPDF from 'jspdf'; 
import '../App.css'; // අපි හදපු modern CSS එක මෙතනට import කරන්න

function AdminDashboard() {
  // ඉල්ලීම් ලැයිස්තුව
  const [requests, setRequests] = useState([
    { id: 101, user: 'Chanula', type: 'E-waste', status: 'Pending', employee: 'Not Assigned', date: '2026-04-20' },
    { id: 102, user: 'Kethmi', type: 'Plastic', status: 'Completed', employee: 'Saman', date: '2026-04-21' },
    { id: 103, user: 'Nimna', type: 'Plastic', status: 'Pending', employee: 'Not Assigned', date: '2026-04-22' },
    { id: 104, user: 'Amila', type: 'Glass', status: 'Assigned', employee: 'Nimal', date: '2026-04-23' },
  ]);

  // --- PDF රිසිට්පත ජෙනරේට් කිරීම ---
  const downloadReceipt = (req) => {
    const doc = new jsPDF();
    
    // Design the PDF
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('SMART WASTE PORTAL', 20, 25);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('OFFICIAL WASTE COLLECTION RECEIPT', 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Receipt ID: #R-2026-${req.id}`, 20, 80);
    doc.text(`Issue Date: ${new Date().toLocaleDateString()}`, 20, 90);
    doc.text(`Customer Name: ${req.user}`, 20, 100);
    doc.text(`Waste Category: ${req.type}`, 20, 110);
    doc.text(`Collected By: ${req.employee}`, 20, 120);
    doc.text(`Status: SUCCESSFULLY COLLECTED`, 20, 130);
    
    doc.setDrawColor(16, 185, 129);
    doc.line(20, 140, 190, 140);
    
    doc.setFontSize(10);
    doc.text('This is a computer-generated receipt. No signature is required.', 20, 150);
    doc.text('Thank you for choosing eco-friendly disposal methods!', 20, 160);

    doc.save(`Receipt_Request_${req.id}.pdf`);
  };

  // සේවකයෙකු යොමු කිරීම
  const assignEmployee = (id) => {
    const empName = prompt("සේවකයාගේ නම ඇතුළත් කරන්න:");
    if (empName) {
      setRequests(requests.map(req => 
        req.id === id ? { ...req, employee: empName, status: 'Assigned' } : req
      ));
    }
  };

  // වැඩේ අවසන් බව සලකුණු කිරීම
  const markAsCollected = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Completed' } : req
    ));
    alert("අපද්‍රව්‍ය එකතු කර අවසන්!");
  };

  // Analytics සඳහා දත්ත (Charts)
  const chartData = useMemo(() => {
    const counts = requests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts).map(key => ({ name: key, count: counts[key] }));
  }, [requests]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="modern-card" style={{ margin: '20px' }}>
      <h2 style={{ color: '#10b981', textAlign: 'center', marginBottom: '30px', letterSpacing: '1px' }}>
        Admin Management & Analytics
      </h2>

      {/* Analytics Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '25px', marginBottom: '40px' }}>
        <div className="modern-card" style={{ flex: '1', minWidth: '320px', background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '20px' }}>Waste Distribution (Type)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px' }} />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="modern-card" style={{ flex: '1', minWidth: '320px', background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '20px' }}>Contribution Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} paddingAngle={5}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Management Table */}
      <div className="modern-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <th style={{ padding: '20px' }}>Request ID</th>
                <th>User</th>
                <th>Waste Type</th>
                <th>Employee</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '20px' }}>#{req.id}</td>
                  <td style={{ fontWeight: '500' }}>{req.user}</td>
                  <td><span style={{ background: '#334155', padding: '4px 10px', borderRadius: '20px', fontSize: '12px' }}>{req.type}</span></td>
                  <td style={{ color: req.employee === 'Not Assigned' ? '#ef4444' : '#f8fafc', fontStyle: 'italic' }}>{req.employee}</td>
                  <td>
                    <span style={{ 
                      color: req.status === 'Completed' ? '#10b981' : '#f59e0b',
                      fontSize: '13px',
                      fontWeight: 'bold'
                    }}>
                      ● {req.status}
                    </span>
                  </td>
                  <td>
                    {req.status === 'Pending' && (
                      <button className="btn-premium" onClick={() => assignEmployee(req.id)} style={{ padding: '6px 15px', fontSize: '11px' }}>Assign</button>
                    )}
                    {req.status === 'Assigned' && (
                      <button className="btn-premium" onClick={() => markAsCollected(req.id)} style={{ padding: '6px 15px', fontSize: '11px', background: '#3b82f6' }}>Mark Collected</button>
                    )}
                    {req.status === 'Completed' && (
                      <button className="btn-premium" onClick={() => downloadReceipt(req)} style={{ padding: '6px 15px', fontSize: '11px', background: '#6366f1' }}>Receipt</button>
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