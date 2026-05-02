import React from 'react';
import '../App.css';

function Tracking() {
  const history = [
    { id: '1', type: 'Plastic', date: '2024-05-01', status: 'Completed' },
    { id: '2', type: 'Glass', date: '2024-05-10', status: 'Pending' },
  ];

  return (
    <div className="activity-wrapper">
      <div className="welcome-msg">
        <h2>Your Activity History 📊</h2>
        <p>ඔබ මින් පෙර සිදුකළ ඉල්ලීම් සහ ඒවායේ වත්මන් තත්ත්වය.</p>
      </div>

      <div className="dash-card">
        <table className="history-table">
          <thead>
            <tr>
              <th>Request ID</th>
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
                <td>
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Tracking;