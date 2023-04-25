import React, {Fragment, useState, useEffect} from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from "uuid";
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL
  } from "firebase/storage";
  import { Listbox, Transition } from '@headlessui/react'
  import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'


const GroundteamProject = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [tickettype, setTickettype] = useState("All");
    const [selectstatus, setSelectstatus] = useState("In Progress");
    const [info, setInfo] = useState({images:{},});

    const ticketType = ["All", "Installation", "Maintenance"];
    const status = ["In Progress", "Completed", "Completion Checking"];


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
      }


    const filter = () => {
        return (
            <div>
                <Listbox value={tickettype} onChange={setTickettype}>
      {({ open }) => (
        <div>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Ticket Type</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{tickettype}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {ticketType.map((ticket) => (
                  <Listbox.Option
                    key={ticket}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={ticket}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {ticket}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </div>
      )}
    </Listbox>

    <Listbox value={selectstatus} onChange={setSelectstatus}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Ticket Status</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="ml-3 block truncate">{selectstatus}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {status.map((statu) => (
                  <Listbox.Option
                    key={statu}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={statu}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <span
                            className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                          >
                            {statu}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
            </div>
        )
    }

    const [tdetail, setTdetail] = useState([])
    useEffect(() => {
        const fetchTicket = async () => {
            if (auth.currentUser){
                let arr = []
                const q = query(collection(db, "ticket"), where("groundteamid", "==", auth.currentUser.uid));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    arr.push({id:doc.id, data: doc.data()});
                });
            setTdetail(arr);
            }
        };
        fetchTicket();
      }, []);
    
    function handleChange (event)  {
        const key = event.target.name;
        const value = event.target.value;
        setInfo(values => ({...values, [key]: value}))
        if (event.target.files) {
            setInfo((prevState) => ({
              ...prevState,
              images: event.target.files,
            }));
          }
      }
    async function handleSubmit(event) {
   
        event.preventDefault();
        if (info.images.length > 6) {
            alert("maximum 6 images are allowed");
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
            [...info.images].map((image) => storeImage(image))
        ).catch((error) => {
            alert("Images not uploaded");
            return;
        });
        // const infoCopy = {
        //     ...info,
            
        //   };
        // delete infoCopy.images;
        const infoRef = doc(db, "ticket", currentTicket);
        
        const infoRef1 = doc(db, "project", currentProject);
        await updateDoc(infoRef, {
               
            completion_description: info.completion_description,
            status: "Completion Checking",
            img: imgUrls
            });
        await updateDoc(infoRef1, {
               
                
            Status: "Completion reported by groundteam. Waiting for check of Manager."
 
            });
         
    
        setInfo("");
        setTrigger(false);
        setCurrentTicket("");
        setCurrentProject("");
        alert("Submitted successfully! Please wait for Manager's confirmation. ");
        window.location.replace('/groundteamdashboard');
        
       
      }
    const renderTickets = () => {
        let detail = tdetail;
        if (selectstatus === 'In Progress'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'In Progress')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation' && d.data.status === 'In Progress')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance' && d.data.status === 'In Progress')
            }
        }
        if (selectstatus === 'Completion Checking'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'Completion Checking')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation' && d.data.status === 'Completion Checking')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance' && d.data.status === 'Completion Checking')
            }
        }else if (selectstatus === 'Completed'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.data.status === 'Completed')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.data.type === 'Installation' && d.data.status === 'Completed')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.data.type === 'Maintenance' && d.data.status === 'Completed')
            }
        }
        if (detail.length === 0){
            return <p>No tickets</p>
        }
        return (
            <>
            <br></br>
            <ul role="list" className="divide-y divide-gray-100">
                {detail.map(ticket => (
                // Ticket(ticket)
                <li key={ticket.id} className="flex justify-between gap-x-6 py-5 bg-slate-50/50 rounded-md p-3">
                    {/* <div className="flex gap-x-4"> */}
                    <div className="min-w-0 flex-auto">
                        <p className="text-m font-bold leading-6 ">Ticket Id: {ticket.id}</p>
                        <p className="mt-1 truncate text-s leading-5 text-gray-900">Project Id: {ticket.data.projectid}</p>
                        <p className="mt-1 truncate text-s leading-5 text-gray-900">Ticket Type: {ticket.data.type}</p>
                        <p className="mt-1 truncate text-s leading-5 text-gray-900">Schedule Date: {ticket.data.date}</p>
                        <p className="mt-1 truncate text-s leading-5 text-gray-900">Earliest Availability: {ticket.data.startTime}</p>
                        <p className="mt-1 truncate text-s leading-5 text-gray-900">Latest Availability: {ticket.data.endTime}</p>
                        <p className="mt-1 truncate text-s leading-5 text-gray-900">Description: {ticket.data.description}</p>
                        <p className="mt-1 truncate text-s leading-5 text-gray-900">Status: {ticket.data.status}</p>
                    </div>
                    {/* </div> */}
                    <div>
                        {(ticket.data.status === 'In Progress') && completeButton(ticket.id, ticket.data.projectid)}
                    </div>
                </li>
                ))}
            </ul>
            </> 
        //   ));
        )}

    const completeButton = (ticketId, projectId) => {
        return <button className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" key={ticketId} onClick={() => handleCompletion(ticketId, projectId)}>Complete</button>
    }

    const [trigger, setTrigger] = useState(false);
    const [currentTicket, setCurrentTicket] = useState('');
    const [currentProject, setCurrentProject] = useState('');
    const handleCompletion = (ticketId, projectId) => {
        setTrigger(true);
        setCurrentTicket(ticketId);
        setCurrentProject(projectId);
    }

    const cancel = () => {
        setTrigger(false);
        setCurrentTicket("");
        setInfo("");
        setCurrentProject("");
    }

    // const complete = async() =>{
    //     const docRef = doc(db, "ticket", currentTicket);
    //     await updateDoc(docRef, {
    //         status: "Completed"
    //     })
    //     .then(() => {
    //         alert(`Ticket ${currentTicket} Completed`)
    //         setTrigger(false);
    //         setCurrentTicket("");
    //     })
    // }

    const checkClick = () =>{
        return (
            <div>
                <div >
                <p> Please add completion description and photo: </p>
                <div>
        
                <form >
                    <p>Completion Description: </p>
                        <textarea 
                        type="text" 
                        name="completion_description" 
                        value={info.completion_description || ""} 
                        onChange={handleChange} 
                        maxLength='800' 
                        required
                        rows="3" 
                        style={{resize: "vertical"}}>
                        </textarea>
                    <p>Images (max 6)</p>
                        <input
                        type="file"
                        id="images"
                        onChange={handleChange}
                        accept=".jpg,.png,.jpeg,.webp"
                        multiple
                        required
                        />
                <br/>
                <button className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={handleSubmit}>Submit</button>
                
                </form>
                <button className="bg-blue-100 hover:bg-transparent text-grey-700 font-semibold py-2 px-4 border border-grey-700 hover:border-transparent rounded" onClick={cancel}>Cancel</button>
             </div>
                
             </div>
            </div>
        )
    }

    const Ticket= (ticket) => {
        return(
            <div key={ticket.id} className='ticketseperator'>
                <div className='tickets'>
                    <div className='left' onClick={()=>{navigate(`/groundteamprojectdashboard/${ticket.id}`)}}>
                        <h4>{ticket.id}</h4>
                        <div>
                            <div>
                            <li>Project Id:{ticket.data.projectid}</li>
                            <li>Ticket Type:{ticket.data.type}</li>
                            <li>Schedule Date:{ticket.data.schedule}</li>
                            <li>Description:{ticket.data.description}</li>
                            <li>Status:{ticket.data.status}</li>
                            </div>
                        </div>
                    </div>
                    <div>
                    {(ticket.data.status === 'In Progress') && completeButton(ticket.id)}
                    </div>
                </div>
            </div>
          )
    }


    return (
        <>
        <div className="text-xl font-bold">Groundteam Ticket</div>
        <div>
        {filter()}
       
        {renderTickets()}

        {(trigger) && checkClick()}
        </div>
        </>
    )
}

export default GroundteamProject