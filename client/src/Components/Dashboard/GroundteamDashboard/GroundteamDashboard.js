import React from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

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

const GroundteamDashboard = () => {
	const auth = getAuth();
    const navigate = useNavigate();


	function onLogout() {
        auth.signOut().then(()=>{
        alert("User Signed out")
        navigate("/");
        }).catch(()=>{
        alert("Error with signning out")
        })
        
      }


	return (
		<>
			
            <h1>Ground team Dashboard</h1>
			<button type="button" className="btn btn-danger btn-m" onClick={onLogout}>Log Out</button>
            

		</>
	);
};

export default GroundteamDashboard;
