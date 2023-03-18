import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../../firebase';
import SalesProject from '../../Projects/SalesProject'
/*
import BackgroundCSL from './Carousel';
import { getDocs } from 'firebase/firestore';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import ListingItem from '../Listingitem/Listingitem.jsx';
//import Slider from "../components/Slider";
import { db } from '../../firebase';
import queries from '../../query';
import '../Style/style.css';
import arrow from "../../Assets/right-arrow.png"

*/

const SalesDashboard = () => {
	const auth = getAuth();
    const navigate = useNavigate();
    const [customer, setCustomers] = useState([]);
    


	function onLogout() {
        auth.signOut().then(()=>{
        alert("User Signed out")
        navigate("/");
        }).catch(()=>{
        alert("Error with signning out")
        })
        
      }

      useEffect(() => {
        async function fetchMessages() {
            
            console.log("Sales Dashboard use effect fired")
            const querySnapshot = await getDocs(collection(db, "CustomerSalesMessaging"));
            let customermessages = []
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              customermessages.push({id:doc.id, data: doc.data()})
            });
            setCustomers(customermessages)
        }
        fetchMessages();
      }, [auth.currentUser.uid]);


	return (
		<>
			
            <h1>Sales Dashboard</h1>
			<button type="button" className="btn btn-danger btn-m" onClick={onLogout}>Log Out</button>
            <br/>
            <br/>
            <br/>
            <h2> Messages from customers</h2>
            <div>     
        <ul>
          {customer.map((cust, index) => (
            <li key={index}><a onClick={()=>{navigate(`/salesmessaging/${cust.id}`)}}>{cust.data.name}</a></li>
          ))}
        </ul>
      </div>
      <SalesProject/>
            

		</>
	);
};

export default SalesDashboard;
