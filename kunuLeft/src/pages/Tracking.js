import React, { useState, useEffect } from 'react';
import '../App.css';

function Tracking() {
  // උදාහරණ දත්ත (පසුව Firebase සමඟ සම්බන්ධ කළ හැක)
  const [activities, setActivities] = useState([
    { id: 'REQ001', date: '2026-05-01', type: 'Plastic', status: 'Completed', weight: '5kg' },
    { id: 'REQ002', date: '2026-05-02', type: 'Organic', status: 'In-Progress', weight: '12kg' },
    { id: 'REQ003', date: '2026-05-02', type: 'Paper', status: 'Pending', weight: '3kg' },
  ]);

  return (
    <div className="dashboard-padding">
      <div className="nav-container">
        <div className="hero-eco">
          <h2 style={{ color: '#16a34a', marginBottom: '10px' }}>My Activity History</h2>
          <p style={{ color: '#475569' }}>Track your waste collection requests and recycling progress.</p>

          {/* Quick Stats Summary */}
          <div className="activity-stats-row">
            <div className="stat-box-custom hero-eco">
              <h3>03</h3>
              <p>Total Requests</p>
            </div>
            <div className="stat-box-custom hero-eco">
              <h3 style={{ color: '#16a34a' }}>01</h3>
              <p>Completed</p>
            </div>
            <div className="stat-box-custom hero-eco">
              <h3 style={{ color: '#ca8a04' }}>02</h3>
              <p>Pending</p>
            </div>
          </div>

          {/* Activity Table */}
          <div style={{ marginTop: '30px', overflowX: 'auto' }}>
            <table className="activity-table-new">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Date</th>
                  <th>Waste Type</th>
                  <th>Weight</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((item) => (
                  <tr key={item.id}>
                    <td><strong>#{item.id}</strong></td>
                    <td>{item.date}</td>
                    <td>{item.type}</td>
                    <td>{item.weight}</td>
                    <td>
                      <span className={`status-pill ${item.status.toLowerCase().replace(' ', '-')}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracking;