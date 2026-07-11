import React, {useEffect, useState} from "react";
import {
    collection,
    onSnapshot,
    doc,
    setDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    query,
    where
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase";
import "../CollectorPage.css";

// PDF IMPORTS - NEW
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function CollectorsPage(){
  const [collectors,setCollectors] = useState([]);
  const [jobs,setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");
  const [showCollectorModal,setShowCollectorModal] = useState(false);
  const [editMode,setEditMode] = useState(false);
  const [selectedCollector,setSelectedCollector] = useState(null);

  const [collectorForm,setCollectorForm] = useState({
      name:"", email:"", phone:"", vehicle:"", area:"", password:""
  });

  // LOAD COLLECTORS
  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"collectors"), (snapshot)=>{
      const data=snapshot.docs.map(doc=>({ id:doc.id,...doc.data() }));
      setCollectors(data);
      setLoading(false);
    });
    return ()=>unsub();
  },[]);

  // LOAD REQUESTS
  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"requests"), (snapshot)=>{
      const data = snapshot.docs.map(doc=>({ id:doc.id,...doc.data() }));
      setJobs(data);
    });
    return ()=>unsub();
  },[]);

  // GET COLLECTOR JOB COUNT
  const getCollectorJobs = (collectorId)=>{
    return jobs.filter(job => job.collectorId === collectorId && job.status!== "Completed").length;
  };

  // GET COMPLETED JOBS - NEW
  const getCompletedJobs = (collectorId)=>{
    return jobs.filter(job => job.collectorId === collectorId && job.status === "Completed");
  };

  // DOWNLOAD PDF - NEW FUNCTION
  const downloadPDF = (collector) => {
    const completedJobs = getCompletedJobs(collector.id);

    if(completedJobs.length === 0){
      alert("No completed jobs for this collector");
      return;
    }

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Completed Jobs Report`, 14, 22);
    doc.setFontSize(12);
    doc.text(`Collector: ${collector.name}`, 14, 30);
    doc.text(`Email: ${collector.email}`, 14, 36);
    doc.text(`Total Completed: ${completedJobs.length}`, 14, 42);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 48);

    // Table Data
    const tableColumn = ["#", "Citizen", "Waste Type", "Location", "Completed Date"];
    const tableRows = [];

    completedJobs.forEach((job, index) => {
      const jobData = [
        index + 1,
        job.userName || "Anonymous",
        job.wasteType || "General",
        job.location? `${job.location.lat.toFixed(4)}, ${job.location.lng.toFixed(4)}` : "N/A",
        job.completedAt?.toDate? job.completedAt.toDate().toLocaleDateString() : "N/A"
      ];
      tableRows.push(jobData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 55,
      theme: 'grid',
      headStyles: { fillColor: [6, 95, 70] }, // #065f46
    });

    doc.save(`${collector.name}_CompletedJobs.pdf`);
  };

  const handleCollectorChange=(e)=>{
    setCollectorForm({...collectorForm, [e.target.name]:e.target.value });
  };

  const saveCollector = async()=>{
    try{
      if(!collectorForm.name ||!collectorForm.email){
        alert("Name and Email required"); return;
      }
      if(editMode){
        await updateDoc(doc(db,"collectors",selectedCollector.id),{
          name:collectorForm.name, phone:collectorForm.phone, vehicle:collectorForm.vehicle, area:collectorForm.area
        });
        await updateDoc(doc(db,"users",selectedCollector.id),{ name:collectorForm.name });
        alert("Collector Updated");
      }else{
        if(!collectorForm.password){ alert("Password required"); return; }
        const userCredential = await createUserWithEmailAndPassword(auth, collectorForm.email, collectorForm.password);
        const uid=userCredential.user.uid;
        await setDoc(doc(db,"users",uid),{ name:collectorForm.name, email:collectorForm.email, role:"collector", createdAt:serverTimestamp() });
        await setDoc(doc(db,"collectors",uid),{ name:collectorForm.name, email:collectorForm.email, phone:collectorForm.phone, vehicle:collectorForm.vehicle, area:collectorForm.area, role:"collector", activeJobs:0, createdAt:serverTimestamp() });
        alert("Collector Added Successfully");
      }
      closeCollectorModal();
    }catch(error){ alert(error.message); }
  };

  const editCollector=(collector)=>{
    setEditMode(true); setSelectedCollector(collector);
    setCollectorForm({ name:collector.name || "", email:collector.email || "", phone:collector.phone || "", vehicle:collector.vehicle || "", area:collector.area || "", password:"" });
    setShowCollectorModal(true);
  };

  const deleteCollector=async(id)=>{
    const confirmDelete = window.confirm("Delete Collector?");
    if(!confirmDelete) return;
    try{ await deleteDoc(doc(db,"collectors",id)); await deleteDoc(doc(db,"users",id)); alert("Collector Deleted"); }
    catch(error){ alert(error.message); }
  };

  const closeCollectorModal=()=>{
    setShowCollectorModal(false); setEditMode(false); setSelectedCollector(null);
    setCollectorForm({ name:"",email:"",phone:"",vehicle:"",area:"",password:"" });
  };

  const filteredCollectors = collectors.filter(c=>{
    const value=search.toLowerCase();
    return c.name?.toLowerCase().includes(value) || c.email?.toLowerCase().includes(value) || c.area?.toLowerCase().includes(value) || c.vehicle?.toLowerCase().includes(value);
  });

  if(loading) return(<div className="loading-spinner">Loading Collectors...</div>);

  return(
    <div className="admin-page-container">
      <div className="modern-admin-card">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h2 style={{color:"#065f46"}}>Collectors Management</h2>
          <button className="btn-premium btn-assign" onClick={()=>{ setEditMode(false); setShowCollectorModal(true); }}>
            ➕ Add Collector
          </button>
        </div>

        <input className="search-box" placeholder="Search collector..." value={search} onChange={(e)=>setSearch(e.target.value)} />

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th> <th>Email</th> <th>Vehicle</th> <th>Area</th> <th>Phone</th>
              <th>Active Jobs</th> <th>Completed</th> <th>Status</th> <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollectors.map(c=>(
              <tr key={c.id}>
                <td>{c.name}</td> <td>{c.email}</td> <td>{c.vehicle || "-"}</td> <td>{c.area || "-"}</td> <td>{c.phone || "-"}</td>

                {/* Active Jobs */}
                <td><span className="status-pill">{ getCollectorJobs(c.id) }</span></td>

                {/* Completed Jobs Count - NEW */}
                <td><span className="status-pill" >{ getCompletedJobs(c.id).length }</span></td>

                {/* Status */}
                <td>
                  { getCollectorJobs(c.id) > 0? <span style={{color:"#f59e0b"}}>🟠 Busy</span> : <span style={{color:"#059669"}}>🟢 Available</span> }
                </td>

                <td>
                  {/* PDF DOWNLOAD BUTTON - NEW */}
                  <button
                    className="btn-premium btn-collect"
                    style={{marginRight:"5px"}}
                    onClick={()=>downloadPDF(c)}
                  >
                    📄 PDF
                  </button>
                  <button className="btn-premium btn-collect" onClick={()=>editCollector(c)}>Edit</button>
                  <button className="btn-premium btn-cancel" onClick={()=>deleteCollector(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD / EDIT MODAL */}
      { showCollectorModal &&
        <div className="modal-overlay">
          <div className="modal-box pro-modal">
            <h2>{ editMode? "Edit Collector" : "Add New Collector" }</h2>
            <div className="form-grid-2col">
              <input name="name" placeholder="Collector Name" value={collectorForm.name} onChange={handleCollectorChange}/>
              <input name="email" placeholder="Email" disabled={editMode} value={collectorForm.email} onChange={handleCollectorChange}/>
              {!editMode && <input name="password" type="password" placeholder="Password" value={collectorForm.password} onChange={handleCollectorChange}/> }
              <input name="phone" placeholder="Phone" value={collectorForm.phone} onChange={handleCollectorChange}/>
              <input name="vehicle" placeholder="Vehicle" value={collectorForm.vehicle} onChange={handleCollectorChange}/>
              <input name="area" placeholder="Area" value={collectorForm.area} onChange={handleCollectorChange}/>
            </div>
            <div className="modal-actions">
              <button className="btn-premium btn-cancel" onClick={closeCollectorModal}>Cancel</button>
              <button className="btn-premium btn-assign" onClick={saveCollector}>
                { editMode? "Update Collector" : "Save Collector" }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  );
}

export default CollectorsPage;