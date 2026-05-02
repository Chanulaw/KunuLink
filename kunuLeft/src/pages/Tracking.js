import React from 'react';
import '../App.css';

function Tracking() {
  // මේවා උදාහරණ දත්ත (Sample Data). පසුව database එකෙන් මේවා ගන්න පුළුවන්.
  const activities = [
    { id: 'REQ-001', type: 'Plastic', date: '2024-05-01', status: 'Completed', location: 'Colombo 03' },
    { id: 'REQ-002', type: 'Glass', date: '2024-05-10', status: 'Pending', location: 'Nugegoda' },
    { id: 'REQ-003', type: 'Electronic', date: '2024-05-15', status: 'In Progress', location: 'Borella' },
    { id: 'REQ-004', type: 'Paper', date: '2024-05-20', status: 'Completed', location: 'Kottawa' },
  ];

  return (
<<<<<<< HEAD
    <div className="activity-wrapper">
      <div className="welcome-msg">
        <h2>Your Activity History 📊</h2>
        <p>ඔබ මින් පෙර සිදුකළ ඉල්ලීම් වල තොරතුරු මෙතැනින් බලන්න.</p>
      </div>

      <div className="dash-card">
        <table className="history-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Waste Type</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>#RQ-00{item.id}</td>
                <td>{item.type}</td>
                <td>{item.date}</td>
                <td><span className={`status ${item.status.toLowerCase()}`}>{item.status}</span></td>
=======
    <div className="activity-page-wrapper">
      <div className="container">
        <header className="activity-header">
          <h2>Your Activity History 📊</h2>
          <p>ඔබ සිදුකළ සියලුම අපද්‍රව්‍ය බැහැර කිරීමේ ඉල්ලීම් මෙතැනින් පරීක්ෂා කරන්න.</p>
        </header>

        <div className="activity-stats-row">
          <div className="stat-box"><h3>04</h3><p>Total Requests</p></div>
          <div className="stat-box"><h3>02</h3><p>Completed</p></div>
          <div className="stat-box"><h3>01</h3><p>Pending</p></div>
        </div>

        <div className="activity-table-container glass-effect">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Waste Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
>>>>>>> parent of b251c18 (update dashboard)
              </tr>
            </thead>
            <tbody>
              {activities.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong></td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
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