import React, {useState, useEffect} from 'react';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase';
import { query, collection, where, getDocs } from 'firebase/firestore';

const GroundteamProject = () => {
    const auth = getAuth();
    const [tickettype, setTickettype] = useState("All");
    const [selectstatus, setSelectstatus] = useState("In Progress");

    const filter = () => {
        return (
            <div>
                <label>filter:</label>
                <select value={tickettype} onChange={(e) => setTickettype(e.target.value)}>
                    <option value="All">All</option>
                    <option value="Installation">Installation</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
                <select value={selectstatus} onChange={(e) => setSelectstatus(e.target.value)}>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
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
                    arr.push(doc.data());
                });
            setTdetail(arr);
            }
        };
        fetchTicket();
      }, []);
    
    
    const renderTickets = () => {
        console.log()
        let detail = tdetail;
        if (selectstatus === 'In Progress'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.status === 'In Progress')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.type === 'Installation')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.type === 'Maintenance')
            }
        }else if (selectstatus === 'Completed'){
            if (tickettype === 'All'){
                detail = detail.filter(d => d.status === 'Completed')
            }
            if (tickettype === 'Installation'){
                detail = detail.filter(d => d.type === 'Installation')
            }else if (tickettype === 'Maintenance'){
                detail = detail.filter(d => d.type === 'Maintenance')
            }
        }
        if (detail.length === 0){
            return <p>No tickets</p>
        }
        return detail.map(t => (
            Ticket(t)
          ))
    }

    const Ticket= (ticket) => {
        return(
            <div key={ticket.ticketid} className='ticketseperator'>
                <div className='tickets'>
                    <div className='left'>
                        <h4>{ticket.ticketid}</h4>
                        <div>
                            <div>
                            <li>Ticket Type:{ticket.type}</li>
                            <li>Schedule Date:{ticket.schedule}</li>
                            <li>Description:{ticket.description}</li>
                            <li>Status:{ticket.status}</li>
                            </div>
                        </div>
                    </div>
                    {/* <div> */}
                    {/* {ticket.status === 'In Progress' && completeButton(ticket.ticketid)} */}
                    {/* </div> */}
                </div>
            </div>
          )
    }


    return (
        <>
        <div>GroundteamProject</div>
            {filter()}
            {renderTickets()}
        </>
    )
}

export default GroundteamProject