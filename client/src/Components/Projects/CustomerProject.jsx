import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

import { doc, getDoc ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";

function CustomerProject() {
    const auth = getAuth();
    const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [purchase, setPurchase] = useState(false)

  
  async function purchaseProject() {
    const docRef = await addDoc(collection(db, "project"), {
      purchased: true,
      customer: auth.currentUser.uid,
      ManagerAccepted: false,
      SaleAuthorised: false,
      customerName: auth.currentUser.displayName,
      saleAssigned: "PTgELGWcZxXa6XFZDxANalMOjLz2"

    });
    //update user collection
    console.log(docRef.id)
    const washingtonRef = doc(db, "users", auth.currentUser.uid);

        // Set the "capital" field of the city 'DC'
    await updateDoc(washingtonRef, {
        projectID: docRef.id
    });

    setPurchase(true)
    alert("Thank You, You just made the world a better place !!");
  
  }


  useEffect(() => {
    async function fetchProject() {
      console.log("customer Project use effect")
      const projectRef = collection(db, "project");

      // Create a query against the collection.
      const q = query(projectRef, where("customer", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      let customerProject = []

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let {customer} = doc.data()
        if(customer === auth.currentUser.uid) {
            setPurchase(true) 
            customerProject.push({id:doc.id, data: doc.data()})
        }
    });

    setProjectData(customerProject)
      

    }
    fetchProject();
  }, [auth.currentUser.uid]);


  return (
    <div>
      <h2>Equipt your home with Solar Panels</h2>
      <div>
        <button onClick={purchaseProject} disabled={purchase}>{purchase ? "Solar Panels Purchased":"Purchase Solar Panels"}</button>
      </div>
      <div>
        <h2>Projects</h2>
        <div>     
        <ul>

          {projectData.length === 0 ? "No Projects Purchased" : projectData.map((project, index) => (
            <div key={index} onClick={()=>{navigate(`/project/${project.id}`)}}>
                <li >ProjectID: {project.id}</li>
                <li>Customer:{project.data.customerName} </li>
                <li>Purchased By: {project.data.customer}</li>
                <li>Sale Authorised: {project.data.SaleAuthorised ? "True" : "False"}</li>
                <li>Project Accepted: {project.data.ManagerAccepted ? "True" : "False"}</li>
                <li>Status: {project.data.Status} </li>
            </div>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
}

export default CustomerProject;
