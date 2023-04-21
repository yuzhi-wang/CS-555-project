import React from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
const Homepage = () => {
	const auth = getAuth();
    const navigate = useNavigate();

	const Container = styled.div`
  height: 100vh;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overflow-y: auto;
  scrollbar-width: none;
  color: white;
  background: url("./img/bg.jpeg");
  &::-webkit-scrollbar{
    display: none;}`;


	return (
		<>
			
            <h1>HomePage</h1>
            <h2>Public page visible to all</h2>
			<button type="button" className="btn btn-danger btn-m" onClick={()=>{navigate("/login")}}>LOGIN</button>
           

		</>
	);
};

export default Homepage;
