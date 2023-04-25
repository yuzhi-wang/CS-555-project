import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

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
    <form className='bg-white'>
      <div className="space-y-12 sm:space-y-16">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Username
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="janesmith"
                  />
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                About
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <textarea
                  id="about"
                  name="about"
                  rows={3}
                  className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Photo
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-x-3">
                  <UserCircleIcon className="h-12 w-12 text-gray-300" aria-hidden="true" />
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Cover photo
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex max-w-2xl justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            Use a permanent address where you can receive mail.
          </p>

          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                First name
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Last name
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="last-name"
                  id="last-name"
                  autoComplete="family-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Email address
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-md sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Country
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Street address
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="street-address"
                  id="street-address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xl sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                City
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="region" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                State / Province
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="region"
                  id="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                ZIP / Postal code
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="postal-code"
                  id="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Notifications</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            We'll always let you know about important changes, but you pick what else you want to hear about.
          </p>

          <div className="mt-10 space-y-10 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <fieldset>
              <legend className="sr-only">By Email</legend>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:py-6">
                <div className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  By Email
                </div>
                <div className="mt-4 sm:col-span-2 sm:mt-0">
                  <div className="max-w-lg space-y-6">
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="comments"
                          name="comments"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="comments" className="font-medium text-gray-900">
                          Comments
                        </label>
                        <p className="mt-1 text-gray-600">Get notified when someones posts a comment on a posting.</p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="candidates"
                          name="candidates"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="candidates" className="font-medium text-gray-900">
                          Candidates
                        </label>
                        <p className="mt-1 text-gray-600">Get notified when a candidate applies for a job.</p>
                      </div>
                    </div>
                    <div className="relative flex gap-x-3">
                      <div className="flex h-6 items-center">
                        <input
                          id="offers"
                          name="offers"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="text-sm leading-6">
                        <label htmlFor="offers" className="font-medium text-gray-900">
                          Offers
                        </label>
                        <p className="mt-1 text-gray-600">Get notified when a candidate accepts or rejects an offer.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend className="sr-only">Push Notifications</legend>
              <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:py-6">
                <div className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                  Push Notifications
                </div>
                <div className="mt-1 sm:col-span-2 sm:mt-0">
                  <div className="max-w-lg">
                    <p className="text-sm leading-6 text-gray-600">These are delivered via SMS to your mobile phone.</p>
                    <div className="mt-6 space-y-6">
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-everything"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="push-everything" className="block text-sm font-medium leading-6 text-gray-900">
                          Everything
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-email"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="push-email" className="block text-sm font-medium leading-6 text-gray-900">
                          Same as email
                        </label>
                      </div>
                      <div className="flex items-center gap-x-3">
                        <input
                          id="push-nothing"
                          name="push-notifications"
                          type="radio"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                        <label htmlFor="push-nothing" className="block text-sm font-medium leading-6 text-gray-900">
                          No push notifications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  //   <div>
  //     {purchase ? null : <>
  //     <h2>Equipt your home with Solar Panels, Fill Details Form</h2>
  //     <div>

  //     <form onSubmit={purchaseProject}>
  //       <p >Contact Person Name</p>
  //       <input
  //         type="text"
  //         id="name"
  //         value={name}
  //         onChange={onChange}
  //         placeholder="Name"
  //         maxLength="32"
  //         minLength="10"
  //         required
  //           />

  //        <p >Contact Person Email</p>
  //         <input
  //         type="email"
  //         id="email"
  //         value={email}
  //         onChange={onChange}
  //         placeholder="Email"
  //         maxLength="32"
  //         minLength="10"
  //         required
  //           />
  //         <p >Contact Person Phone Number</p>
  //         <input
  //         type="tel"
  //         id="mobile"
  //         value={mobile}
  //         onChange={onChange}
  //         placeholder="Mobile number"
  //         maxLength="10"
  //         minLength="10"
  //         required
  //           />

  //       <p >Location Hours of operation</p>   
  //       <p>Date</p>
  //       <input type="date" id="date" name="date" value={date} onChange={(event) => {
  //   setDate(event.target.value);
  // }} required />
  //       <p>Start Time</p>
  //       <input type="time" id="appt" name="start" value={startTime} onChange={(event) => {
  //   setStartTime(event.target.value);
  // }}
  //      min="06:00" max="21:00" required/>
  //       <p>End Time</p>
  //       <input type="time" id="appt" name="end" value={endTime} onChange={(event) => {
  //   setEndTime(event.target.value);
  // }}
  //      min="06:00" max="21:00" required/>
  //     <small>Please select anytime between 6:00 am - 9:00 PM</small>

 
  //       <p>Address</p>
  //       <textarea
  //         type="text"
  //         id="address"
  //         value={address}
  //         onChange={onChange}
  //         placeholder="Address"
  //         required
  //           />

  //       <p >Location Additional Description</p>
  //       <textarea
  //         type="text"
  //         id="description"
  //         value={description}
  //         onChange={onChange}
  //         placeholder="Description"
  //         required
  //          />
  //       <div >
          
  //           <p >Proposed project size, in solar panel sqft size</p>
  //           <div >
  //             <textarea
  //               type="text"
  //               id="projectsize"
  //               value={projectsize}
  //               onChange={onChange}
  //               placeholder="Project Size"
  //               maxLength="32"
  //               minLength="1"
              
  //                />
  //           </div>
        
  //       </div>
  //       <div>
  //         <p>Images (max 6)</p>
  //         <input
  //           type="file"
  //           id="images"
  //           onChange={onChange}
  //           accept=".jpg,.png,.jpeg,.webp"
  //           multiple
  //           required
  //          />
  //       </div>
  //       <br/>
  //       <button type="submit" disabled={purchase}>Submit Details Form</button>
  //     </form>
  //     </div>
  //     </>}
  //     <div>
  //       <h2>Projects</h2>
  //       <div>     
  //       <ul>

  //         {projectData.length === 0 ? "No Projects Initiated Fill the details form and get in touch with the Sales Team" : projectData.map((project, index) => (
  //           <div key={index} onClick={()=>{navigate(`/customerprojectdashboard/${project.id}`)}}>
  //               <li >ProjectID: {project.id}</li>
  //               <li>Customer:{project.data.customerName} </li>
  //               <li>Purchased By: {project.data.customer}</li>
  //               <li>Sale Authorised: {project.data.SaleAuthorised ? "True" : "False"}</li>
  //               <li>Project Accepted: {project.data.ManagerAccepted ? "True" : "False"}</li>
  //               <li>Status: {project.data.Status} </li>
  //           </div>
  //         ))}
  //       </ul>
  //     </div>
  //     </div>
  //   </div>
  );
}

export default CustomerProject;
