import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";

function ManagerNewProject() {

    const auth = getAuth();
    const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [projectAccepted, setprojectAccepted] = useState(false);

  async function acceptProject(projectID) {
    
    //update user collection
    const projectRef = doc(db, "project", projectID);

        // Set the "capital" field of the city 'DC'
    await updateDoc(projectRef, {
      ManagerAccepted: true,
      managerAssigned: auth.currentUser.uid,
      Status: "Manager Confirmed, Project will start Soon"
    });

    alert(`Project ${projectID} Accepted`);
  
  }

async function declineProject(projectID) {
    const projectRef = doc(db, "project", projectID);

    // Set the "capital" field of the city 'DC'
await updateDoc(projectRef, {
  ManagerAccepted: false,
  managerAssigned: "",
  Status: "Declined by Manager"
});

alert(`Declined Project ${projectID} `);
}


  useEffect(() => {
    async function fetchProject() {
      console.log("Manager Project use effect")
      const projectRef = collection(db, "project");

      // Create a query against the collection.
      const q = query(projectRef, where("ManagerAccepted", "==", false));
      const querySnapshot = await getDocs(q);
      let Project = []

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
           Project.push({id:doc.id, data: doc.data()})
      
    });
    setProjectData(Project)
      

    }
    fetchProject();
  }, [auth.currentUser.uid]);



  return (
    <div>
        <div>     
        <ul>

          {projectData.length === 0 ? "No Projects On Going" : projectData.map((project, index) => (
            <div key={index}>
            <div  onClick={()=>{navigate(`/saleprojectdashboard/${project.id}`)}}>
                <li >ProjectID: {project.id}</li>
                <li>Customer:{project.data.customerName} </li>
                <li>Purchased By: {project.data.customer}</li>
                <li>Sale Authorised: {project.data.SaleAuthorised ? "True" : "False"}</li>
                <li>Project Accepted: {project.data.ManagerAccepted ? "True" : "False"}</li>
                <li>Status: {project.data.Status} </li>
                </div>
            <h3>Accept this Project ?</h3>
            <>
            <div>
              <button onClick={()=>acceptProject(project.id)} disabled={project.data.ManagerAccepted}>Accept</button>
            </div>
            </>
             
            <br/>
            </div>
            
          ))}
        </ul>
      </div>
      </div>
  );
}

export default ManagerNewProject;