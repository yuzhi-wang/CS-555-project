import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs, deleteDoc} from "firebase/firestore"; 
import { db } from "../../firebase";

function ManagerProjectControls({data}) {
    
  isEmptyObject(data.projectData)
    const [project ,setProject] = useState({})
    let auth = data.auth

    
    
    const navigate = useNavigate();
  
  const [projectAccepted, setprojectAccepted] = useState(false);

  async function acceptProject(projectID) {
    
    //update user collection
    const projectRef = doc(db, "project", projectID);

        // Set the "capital" field of the city 'DC'
    await updateDoc(projectRef, {
        ManagerAccepted: true,
      Status: "Manager Confirmed, Project will start Soon"
    });

    alert(`Project ${projectID} Accepted`);
  
  }

async function declineProject(projectID, data) {
    
  const ticketRef = doc(db, "ticket", data.installationTicketID); 
  deleteDoc(ticketRef)
   
    
  const projectRef = doc(db, "project", projectID);
  await updateDoc(projectRef, {
  ManagerAccepted: false,
  Status: "Paused by Manager",
  managerAssigned: ""
});

alert(`Declined Project ${projectID} `);
}


  const [trigger, setTrigger] = useState(false);
  const [currentProject, setCurrentProject] = useState("");

  const handelReassign = (projectId) => {
    setTrigger(true);
    setCurrentProject(projectId);
  }

  const [groundteamList, setGoundteamList] = useState([]);
  const [groundteamid, setGoundteamId] = useState('');


  const groundteamSelector = () => {
    return groundteamList.map(g => (<option key={g.id} value={g.id}>{g.data.name}</option>))
  }

  const reassignGroundteam = (projectId) => {
    return(
      <>
        <form onSubmit={(e) => handelAccept(e)}>
          <label htmlFor="project">Project Id:</label><br></br>
          <input type="text" readOnly={true} placeholder={currentProject} value={currentProject} ></input><br></br>
          <label htmlFor="groundteam">Reassign to a Ground Team:</label><br></br>
          <select value={groundteamid} onChange={(e) => setGoundteamId(e.target.value)} >
            {groundteamSelector()}
          </select>
          <input type="submit"></input>
          <button onClick={closeWindow}>Cancel</button>
        </form>
      </>
    )
  }

  const closeWindow = () => {
    setTrigger(false);
    setGoundteamId("");
  }

  const handelAccept = async (e) => {
    e.preventDefault();
    try{
      // update ticket collection
      const q = query(collection(db, "ticket"), where("projectid", "==", currentProject));
      const querySnapshot = await getDocs(q);
      var docId = "";
      var oldGroundteam = "";
      querySnapshot.forEach((doc) => {
        docId = doc.id;
        oldGroundteam = doc.data().groundteamid;
      });
      if (oldGroundteam === groundteamid){
        alert('No update');
        return;
      }
      const ticketRef = doc(db, "ticket", docId);
      await updateDoc(ticketRef, {
          groundteamid: groundteamid,
          img:"",
          completion_description:"",
          manager_diaspproval:""
      });

      alert(`Project ${currentProject} Reassigned`)
      setTrigger(false);
      setCurrentProject("");
    }catch(e){
      alert(e);
    };
  }
  const isEmptyObject = (project) => {
    return Object.keys(project).length === 0 && project.constructor === Object;
}


  if(!isEmptyObject)
  return (
    <div>
        <div>     

            {project.data.ManagerAccepted ? <h3>Project Controls</h3> : <h3>Start this Project ?</h3>}
           
            <div>
              <button onClick={()=>acceptProject(project.id,project.data)} disabled={project.data.ManagerAccepted}>Accept</button>
              <button onClick={()=>declineProject(project.id, project.data)} disabled={project.data.Status === "Declined by Manager"}>Decline</button>
              <button onClick={()=>handelReassign(project.id)}>Reassign Groundteam</button>
             
            </div>
        </div>
    </div>
  );
}

export default ManagerProjectControls;