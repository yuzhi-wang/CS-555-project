import React, {useState, useEffect} from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { query, collection, where, getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';

const GroundteamDisapprovalProject = () => {

    const auth = getAuth();
    const [tdetail, setTdetail] = useState([])
    useEffect(() => {
        
        const fetchTicket = async () => {
            if (auth.currentUser){
                let arr = []
                const q = query(collection(db, "ticket"), where("groundteamid", "==", auth.currentUser.uid), 
                where("status", "==", "Completion Disapproved"));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    arr.push({id:doc.id, data: doc.data()});
                });
            setTdetail(arr);
            }
        };
        fetchTicket();
    }, []);
    const AcknowledgedButton = (ticketId) => {
        return <button key={ticketId} onClick={() => handleAcknowledged(ticketId)}>Acknowledged</button>
    }
    async function handleAcknowledged(ticketId) {
   
        
         
          const infoRef = doc(db, "ticket", ticketId);
        
          
            await updateDoc(infoRef, {
               
                
                status: "In Progress"
 
              });
           
         
    
          
          alert("Acknowledged. Reset the status to In Progress.");
          window.location.replace('/groundteamdashboard');
        
       
      }
    const renderTickets = () => {
        let detail = tdetail;
        
        if (detail.length === 0){
            let s = <div>
            <p>No Project Disapproved</p>
            
            </div>
            return s; 
            
        }
        // console.log(idetail)
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
                        <p className="mt-1 text-s leading-5 text-gray-900">Project Id: {ticket.data.projectid}</p>
                        <p className="mt-1 text-s leading-5 text-gray-900">Ticket Type: {ticket.data.type}</p>
                        <p className="mt-1 text-s leading-5 text-gray-900">Schedule Date: {ticket.data.date}</p>
                        <p className="mt-1 text-s leading-5 text-gray-900">Earliest Availability: {ticket.data.startTime}</p>
                        <p className="mt-1 text-s leading-5 text-gray-900">Latest Availability: {ticket.data.endTime}</p>
                        <p className="mt-1 text-s leading-5 text-gray-900">Description: {ticket.data.description}</p>
                        <p className="mt-1 text-s leading-5 text-gray-900">Status: {ticket.data.status}</p>
                    </div>
                    {/* </div> */}
                </li>
                ))}
            </ul>
            </> 
        //   ));
        )}
   
    return (
        <>
        <div className="text-xl font-bold">Disapproved Completion</div>
        
        {renderTickets()}
        
        </>
    )


}

export default GroundteamDisapprovalProject