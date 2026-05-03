import React, { useState } from 'react';
import '../App.css';

function Tracking() {
  const [activities] = useState([
    { id: 'REQ001', date: '2026-05-01', type: 'Plastic', status: 'Completed', weight: '5kg' },
    { id: 'REQ002', date: '2026-05-02', type: 'Organic', status: 'In-Progress', weight: '12kg' },
    { id: 'REQ003', date: '2026-05-02', type: 'Paper', status: 'Pending', weight: '3kg' },
  ]);

  return (
    <div className="tracking-page-container">
      <div className="activity-card">
        {/* Title Section */}
        
        <h2 style={{ color: '#16a34a', margin: '10px 0' }}>Activity History</h2>
        <p style={{ color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
          Track your waste collection requests and recycling progress.
        </p>

        {/* Stats Section */}
        <div className="activity-stats-row">
          <div className="stat-box-custom">
            <h3>03</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Total</p>
          </div>
          <div className="stat-box-custom">
            <h3 style={{ color: '#10b981' }}>01</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed</p>
          </div>
          <div className="stat-box-custom">
            <h3 style={{ color: '#ca8a04' }}>02</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Pending</p>
          </div>
        </div>

        {/* Table Section */}
        <div style={{ overflowX: 'auto' }}>
          <table className="activity-table-new">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Type</th>
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
  );
}

export default Tracking;