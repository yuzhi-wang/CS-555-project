import React from "react";
import "./Login.styles.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../OAuth/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Toggle from "./Login.toggle";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
//   const inputs = document.querySelectorAll(".input_field");
//   const toggle_btn = document.querySelectorAll(".toggle");
//   const main = document.querySelector("main");
//   const bullets = document.querySelectorAll(".bullets span");
//   const images = document.querySelectorAll(".image");

//   inputs.forEach((inp) => {
//     inp.addEventListener("focus", () => {
//       inp.classList.add("active");
//     });
//     inp.addEventListener("blur", () => {
//       if (inp.value != "") return;
//       inp.classList.remove("active");
//     });
//   });

//   toggle_btn.forEach((btn) => {
//     btn.addEventListener("click", () => {
//       main.classList.toggle("sign_up_mode");
//     });
//   });
  async function onSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        const docRef = doc(db, "users", userCredential.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          let { role } = docSnap.data();
          if (role === "customer") navigate("/customerdashboard");
          if (role === "manager") navigate("/managerdashboard");
          if (role === "groundteam") navigate("/groundteamdashboard");
          if (role === "sales") navigate("/salesdashboard");
        }
      }
    } catch (error) {
      alert("Bad user credentials");
    }
  }
  return (
    <main id = "main">
    <div className="box">
      <div className="inner_box">
        <div className="forms_wrap">
        
          <form  className="sign_in_form">
            <div className="logo">
              <img src="./img/logo.png" alt="easyclass" />
              <h4>easyclass</h4>
            </div>

            <div className="heading">
              
              <h2>Welcome Back</h2>
              <h6>Not registred yet?</h6>
              <Toggle></Toggle> 
            </div>

            <div className="actual_form">
              <div className="input_wrap">
                <input
                  type="text"
                  minLength="4"
                  className="input_field"
                  
                  required
                />
                <label>Name</label>
              </div>

              <div className="input_wrap">
                <input
                  type="password"
                  minLength="4"
                  className="input_field"
                  
                  required
                />
                <label>Password</label>
              </div>

              <button type="submit" value="Sign In" className="sign_btn" />

              <p className="text">
                Forgotten your password or you login datails?
                {/* <a href="#">Get help</a> signing in */}
              </p>
            </div>
          </form>

          <form  className="sign_up_form">
            <div className="logo">
              <img src="./img/logo.png" alt="easyclass" />
              <h4>easyclass</h4>
            </div>

            <div className="heading">
              <h2>Get Started</h2>
              <h6>Already have an account?</h6>
              <Toggle></Toggle>
            </div>

            <div className="actual_form">
              <div className="input_wrap">
                <input
                  type="text"
                  minLength="4"
                  className="input_field"
                  
                  required
                />
                <label>Name</label>
              </div>

              <div className="input_wrap">
                <input
                  type="email"
                  className="input_field"
                  
                  required
                />
                <label>Email</label>
              </div>

              <div className="input_wrap">
                <input
                  type="password"
                  minLength="4"
                  className="input_field"
                  
                  required
                />
                <label>Password</label>
              </div>

              <input type="submit" value="Sign Up" className="sign_btn" />

              <p className="text">
                By signing up, I agree to the
                <a href="#">Terms of Services</a> and
                <a href="#">Privacy Policy</a>
              </p>
            </div>
          </form>
        </div>

        <div className="carousel">
          <div className="images_wrapper">
            <img
              src="client\public\image1.png"
              className="image img-1 show"
              alt=""
            />
            <img src="client\public\image1.png" className="image img-2" alt="" />
            <img src="client\public\image1.png" className="image img-3" alt="" />
          </div>

          <div className="text_slider">
            <div className="text_wrap">
              <div className="text_group">
                <h2>Create your own courses</h2>
                <h2>Customize as you like</h2>
                <h2>Invite students to your className</h2>
              </div>
            </div>

            <div className="bullets">
              <span className="active" data-value="1"></span>
              <span data-value="2"></span>
              <span data-value="3"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </main>
  );
};

export default Login;
