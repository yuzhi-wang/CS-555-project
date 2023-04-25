import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";

function SalesProject() {

    const auth = getAuth();
    const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [projectAccepted, setprojectAccepted] = useState(false);

  async function acceptProject(projectID) {
    
    //update user collection
    const projectRef = doc(db, "project", projectID);

        // Set the "capital" field of the city 'DC'
    await updateDoc(projectRef, {
      SaleAuthorised: true,
      Status: "Awaiting Manager Confirmation"
    });

    alert(`Project ${projectID} Accepted`);
  
  }

async function declineProject(projectID) {
    const projectRef = doc(db, "project", projectID);

    // Set the "capital" field of the city 'DC'
await updateDoc(projectRef, {
  SaleAuthorised: false,
  Status: "Declined by Sales"
});

alert(`Declined Project ${projectID} `);
}


  useEffect(() => {
    async function fetchProject() {
      console.log("Sales Project use effect")
      const projectRef = collection(db, "project");

      // Create a query against the collection.
      const q = query(projectRef, where("saleAssigned", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      let customerProject = []

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let {saleAssigned,SaleAuthorised} = doc.data()
        if(saleAssigned === auth.currentUser.uid) {
            customerProject.push({id:doc.id, data: doc.data()})
            if(SaleAuthorised) setprojectAccepted(true)
        }
    });

    setProjectData(customerProject)
      

    }
    fetchProject();
  }, [auth.currentUser.uid]);



  return (
    <div>
      <div>     
        <ul>
          {projectData.length === 0 ? "No Projects Purchased" : projectData.map((project, index) => (
            <div key={index}> 
            <br></br>
            <div className='bg-slate-50/50 rounded-md p-5'>  
              <ul className="divide-y divide-gray-100">
                <li className="flex justify-between gap-x-6 py-5 ">
                  <div className="min-w-0 flex-auto">
                    <p className="text-m font-bold leading-6 ">ProjectID: {project.id}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Customer: {project.data.customerName} </p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Purchased By: {project.data.customer}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Sale Authorised: {project.data.SaleAuthorised ? "True" : "False"}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Project Accepted: {project.data.ManagerAccepted ? "True" : "False"}</p>
                    <p className="mt-1 text-s leading-5 text-gray-900">Status: {project.data.Status}</p>
                  </div>
                  <div>
                    <button className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={()=>{navigate(`/saleprojectdashboard/${project.id}`)}}>Project Detail</button>
                  </div>
                </li>
              </ul>
            </div>
            </div>
          ))}
            </ul>
            </div>
            </div>

          //   {/*
          //   {project.data.SaleAuthorised ? <h3>Project Confirmed</h3> : <h3>Accept this Project ?</h3>}
          //   <>
          //   <div>
          //     <button onClick={()=>acceptProject(project.id)} disabled={project.data.SaleAuthorised}>Accept</button>
          //     <button onClick={()=>declineProject(project.id)} disabled={project.data.Status === "Declined by Sales"}>Decline</button>
          //   </div>
          //   </>
          // */}
        
)}

export default SalesProject;
