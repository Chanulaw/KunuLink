import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

function AdminDashboard() {
  // ඉල්ලීම් ලැයිස්තුව (Initial Data)
  const [requests, setRequests] = useState([
    { id: 101, user: 'Chanula', type: 'E-waste', status: 'Pending', employee: 'Not Assigned' },
    { id: 102, user: 'Kethmi', type: 'Plastic', status: 'Pending', employee: 'Not Assigned' },
    { id: 103, user: 'Nimna', type: 'Plastic', status: 'Pending', employee: 'Not Assigned' },
    { id: 104, user: 'Amila', type: 'Glass', status: 'Pending', employee: 'Not Assigned' },
  ]);

  // සේවකයෙකු යොමු කිරීම (Assign Employee)
  const assignEmployee = (id) => {
    const empName = prompt("සේවකයාගේ නම ඇතුළත් කරන්න (Enter Employee Name):");
    if (empName) {
      setRequests(requests.map(req => 
        req.id === id ? { ...req, employee: empName, status: 'Assigned' } : req
      ));
    }
  };

  // වැඩේ අවසන් බව සලකුණු කිරීම (Mark as Collected)
  const markAsCollected = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Completed' } : req
    ));
    alert("අපද්‍රව්‍ය එකතු කර අවසන් බව සලකුණු කරන ලදී!");
  };

  // Analytics සඳහා දත්ත ගණනය කිරීම (Dynamic)
  const chartData = useMemo(() => {
    const counts = requests.reduce((acc, req) => {
      acc[req.type] = (acc[req.type] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    }));
  }, [requests]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#2e7d32', textAlign: 'center' }}>Admin Management & Analytics</h2>
      <hr />

      {/* --- Analytics Section --- */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '40px', marginTop: '20px' }}>
        <div style={{ flex: '1', minWidth: '300px', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4 style={{ textAlign: 'center' }}>අපද්‍රව්‍ය වර්ගීකරණය (By Type)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#2e7d32" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: '1', minWidth: '300px', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4 style={{ textAlign: 'center' }}>එකතු කිරීමේ ප්‍රගතිය (Status)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- Management Table --- */}
      <h3>ඉල්ලීම් කළමනාකරණය (Manage Requests)</h3>
      <div style={{ overflowX: 'auto' }}>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', marginTop: '10px' }}>
          <thead style={{ backgroundColor: '#2e7d32', color: 'white' }}>
            <tr>
              <th style={{ padding: '10px' }}>ID</th>
              <th>පරිශීලක</th>
              <th>අපද්‍රව්‍ය වර්ගය</th>
              <th>සේවකයා</th>
              <th>තත්ත්වය (Status)</th>
              <th>ක්‍රියාමාර්ග (Actions)</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id}>
                <td style={{ padding: '10px' }}>{req.id}</td>
                <td>{req.user}</td>
                <td>{req.type}</td>
                <td style={{ fontStyle: 'italic', color: req.employee === 'Not Assigned' ? 'red' : 'black' }}>
                  {req.employee}
                </td>
                <td style={{ fontWeight: 'bold', color: req.status === 'Completed' ? 'green' : 'orange' }}>
                  {req.status}
                </td>
                <td style={{ padding: '10px' }}>
                  {req.status === 'Pending' && (
                    <button onClick={() => assignEmployee(req.id)} style={{ backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' }}>
                      Assign Employee
                    </button>
                  )}
                  {req.status === 'Assigned' && (
                    <button onClick={() => markAsCollected(req.id)} style={{ backgroundColor: '#388e3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                      Mark Collected
                    </button>
                  )}
                  {req.status === 'Completed' && <span style={{ color: 'green' }}>✓ Finished</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;