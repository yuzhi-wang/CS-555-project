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

const Homepage = () => {
	const auth = getAuth();
    const navigate = useNavigate();


	


	return (
		<>
			
            <h1>HomePage</h1>
            <h2>Public page visible to all</h2>
			<button type="button" className="btn btn-danger btn-m" onClick={()=>{navigate("/login")}}>LOGIN</button>
           

		</>
	);
};

export default Homepage;
