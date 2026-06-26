import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function CollectorDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const collectorId = user?.uid;

        const querySnapshot = await getDocs(collection(db, 'requests'));

        const allJobs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // 🚛 ONLY assigned jobs filter
        const assignedJobs = allJobs.filter(
          job => job.assignedCollectorId === collectorId
        );

        setJobs(assignedJobs);

      } catch (error) {
        console.error("Error loading jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="collector-dashboard">

      <h2>🚛 My Assigned Jobs</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No assigned jobs yet</p>
      ) : (
        jobs.map(job => (
          <div key={job.id} className="job-card">

            <h3>{job.title || "Waste Pickup"}</h3>

            <p>
              📍 Location: {job.location?.lat}, {job.location?.lng}
            </p>

            <p>
              📌 Status: {job.status}
            </p>

            <button>
              View Map
            </button>

          </div>
        ))
      )}

    </div>
  );
}

export default CollectorDashboard;