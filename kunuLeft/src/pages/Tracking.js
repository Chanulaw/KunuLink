import React, { useState } from 'react';

function Tracking() {
  // දැනට පද්ධතියේ ඇති තොරතුරු (Dummy Data - පසුව Database එකෙන් ගනු ලබයි)
  const [myRequests] = useState([
    { id: 101, type: 'E-waste', date: '2026-04-12', status: 'Assigned', employee: 'Saman Kumara' },
    { id: 105, type: 'Plastic', date: '2026-04-13', status: 'Pending', employee: 'Not Assigned Yet' }
  ]);

  // Status එක අනුව පාට වෙනස් කරන Function එක
  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return '#f39c12'; // තැඹිලි
      case 'Assigned': return '#3498db'; // නිල්
      case 'Completed': return '#27ae60'; // කොළ
      default: return '#7f8c8d';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h2 style={{ color: '#2e7d32', textAlign: 'center' }}>ඔබේ ඉල්ලීම් පරීක්ෂා කිරීම (Track My Request)</h2>
      <p style={{ textAlign: 'center', color: '#666' }}>ඔබ යොමු කළ අපද්‍රව්‍ය එකතු කිරීමේ ඉල්ලීම් වල වත්මන් තත්ත්වය මෙතැනින් බලන්න.</p>

      <div style={{ marginTop: '30px' }}>
        {myRequests.map((req) => (
          <div key={req.id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '10px', 
            padding: '15px', 
            marginBottom: '15px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fff'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>Request #{req.id} - {req.type}</h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#888' }}>යොමු කළ දිනය: {req.date}</p>
              <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>
                සේවකයා: <span style={{ color: '#555' }}>{req.employee}</span>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ 
                backgroundColor: getStatusColor(req.status), 
                color: 'white', 
                padding: '5px 15px', 
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {req.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Summary for User (පරිශීලකයාට තමන්ගේ දායකත්වය පෙන්වීමට) */}
      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px', textAlign: 'center' }}>
        <h4>ඔබේ දායකත්වය (Your Impact) 🌍</h4>
        <p>ඔබ මේ දක්වා අපද්‍රව්‍ය වාර <strong>2ක්</strong> නිවැරදිව බැහැර කිරීමට උදවු වී ඇත. දිගටම අප සමඟ රැඳී සිටින්න!</p>
      </div>
    </div>
  );
}

export default Tracking;