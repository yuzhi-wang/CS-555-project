import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, getDoc,serverTimestamp ,arrayUnion, updateDoc, arrayRemove, setDoc,collection, addDoc,query, where,getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";

function CustomerProject() {
    const auth = getAuth();
    const navigate = useNavigate();
  const [projectData, setProjectData] = useState([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime]= useState("")
  const [endTime, setEndTime]= useState("")
  const [purchase, setPurchase] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    email:"",
    mobile:"",
    projectsize: "",
    images: {},
  

  });
  const {
    name,
    mobile,
    email,
    address,
    description,
    projectsize,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    // Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  
  async function purchaseProject(e) {
    
//---------------------------------------
    e.preventDefault();
    if (images.length > 6) {
      alert("maximum 6 images are allowed");
      return;
    }

    if (address === undefined) {
        alert("please enter a correct address");
        return;
    }
   

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      alert("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      date: date,
      startTime: startTime,
      endTime: endTime,
      timestamp: serverTimestamp(),
      customer: auth.currentUser.uid,
      purchased: true,
      ManagerAccepted: false,
      SaleAuthorised: false,
      customerName: auth.currentUser.displayName,
      saleAssigned: "Z8CbFK7ASdUIr7tHzfYW1KZ21T53",
      Status: "Awaiting approval by Sales",
      SentToManager:false,
      CustomerSignature:"",
      salesSignature: "",
      Quote: "",
      Proposal : "",
      managerAssigned: "",
    };
    delete formDataCopy.images;
    const docRef = await addDoc(collection(db, "project"), formDataCopy);
     //update user collection
  
     const washingtonRef = doc(db, "users", auth.currentUser.uid);


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
      {purchase ? null : <>
      <h2>Equipt your home with Solar Panels, Fill Details Form</h2>
      <div>

      <form onSubmit={purchaseProject}>
        <p >Contact Person Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
            />

         <p >Contact Person Email</p>
          <input
          type="email"
          id="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          maxLength="32"
          minLength="10"
          required
            />
          <p >Contact Person Phone Number</p>
          <input
          type="tel"
          id="mobile"
          value={mobile}
          onChange={onChange}
          placeholder="Mobile number"
          maxLength="10"
          minLength="10"
          required
            />

        <p >Location Hours of operation</p>   
        <p>Date</p>
        <input type="date" id="date" name="date" value={date} onChange={(event) => {
    setDate(event.target.value);
  }} required />
        <p>Start Time</p>
        <input type="time" id="appt" name="start" value={startTime} onChange={(event) => {
    setStartTime(event.target.value);
  }}
       min="06:00" max="21:00" required/>
        <p>End Time</p>
        <input type="time" id="appt" name="end" value={endTime} onChange={(event) => {
    setEndTime(event.target.value);
  }}
       min="06:00" max="21:00" required/>
      <small>Please select anytime between 6:00 am - 9:00 PM</small>

 
        <p>Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
            />

        <p >Location Additional Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
           />
        <div >
          
            <p >Proposed project size, in solar panel sqft size</p>
            <div >
              <textarea
                type="text"
                id="projectsize"
                value={projectsize}
                onChange={onChange}
                placeholder="Project Size"
                maxLength="32"
                minLength="1"
              
                 />
            </div>
        
        </div>
        <div>
          <p>Images (max 6)</p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg,.webp"
            multiple
            required
           />
        </div>
        <br/>
        <button type="submit" disabled={purchase}>Submit Details Form</button>
      </form>
      </div>
      </>}
      <div>
        <h2>Projects</h2>
        <div>     
        <ul>

          {projectData.length === 0 ? "No Projects Initiated Fill the details form and get in touch with the Sales Team" : projectData.map((project, index) => (
            <div key={index} onClick={()=>{navigate(`/customerprojectdashboard/${project.id}`)}}>
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
