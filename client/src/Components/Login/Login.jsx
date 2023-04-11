import React from "react";
import "./Login.styles.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../OAuth/OAuth";
import {
  signInWithEmailAndPassword,
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import Toggle from "./Login.toggle";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name ,email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  // sign up
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
  //sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      updateProfile(auth.currentUser, {
        displayName: name,
       });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();
      formDataCopy.role = "customer";

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      navigate("/customerdashboard");
      alert("Sign up was successful");
    } catch (error) {
      alert("Something went wrong with the registration");
    }
  };
  return (
    <main id="main">
      <div className="box">
        <div className="inner_box">
          <div className="forms_wrap">
            <form onSubmit={onSubmit} className="sign_in_form">
              <div className="logo">
                <img
                  src="https://i.ibb.co/sjwF7Nf/Solmate-logos-black.png"
                  alt="Solmate-logos-black"
                  border="0"
                />
                <h4>solmate</h4>
              </div>

              <div className="heading">
                <h2>Welcome Back</h2>
                <h6>Not registred yet?</h6>
                <Toggle></Toggle>
              </div>

              <div className="actual_form">
                <div className="input_wrap">
                  <input
                    id="email"
                    type="email"
                    onChange={onChange}
                    minLength="4"
                    value={email}
                    className="input_field"
                    placeholder="Email"
                  />
                </div>
                <div className="input_wrap">
                  <input
                    onChange={onChange}
                    id="password"
                    type="password"
                    minLength="8"
                    className="input_field"
                    placeholder="Password"
                  />
                </div>
                <button className="sign_btn"> Login</button> <OAuth></OAuth>
                <p className="text">
                  Forgotten your password or help?<Toggle></Toggle>
                  {/* <a href="#">Get help</a> signing in */}
                </p>
              </div>
            </form>

            <form className="sign_up_form" onSubmit={handleSubmit}>
              <div className="logo">
                <img
                  src="https://i.ibb.co/sjwF7Nf/Solmate-logos-black.png"
                  alt="Solmate-logos-black"
                  border="0"
                />
                <h4>solmate</h4>
              </div>

              <div className="heading">
                <h2>Get Started</h2>
                <h6>Already have an account?</h6>
                <Toggle></Toggle>
              </div>

              <div className="actual_form">
                <div className="input_wrap">
                  <input
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    onChange={onChange}
                    value={name}
                    className="input_field"
                    required
                  />
                </div>

                <div className="input_wrap">
                  <input
                    id="email"
                    minLength="4"
                    className="input_field"
                    type="email"
                    placeholder="Email"
                    onChange={onChange}
                    value={email}
                  />
                </div>
                <div className="input_wrap">
                  <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={onChange}
                    value={password}
                    minLength="8"
                    className="input_field"
                    required
                  />
                </div>

                <input type="submit" value="Sign Up" className="sign_btn" />
                <OAuth></OAuth>
                <p className="text">
                  By signing up, I agree to the
                  <a href="#">Terms of Services</a> and
                  <a href="#">Privacy Policy</a>
                </p>
              </div>
            </form>
          </div>

          <div className="carousel">
            <div className="images_wrapper"></div>

            <div className="text_slider">
              <div className="text_wrap">
                <div className="text_group">
                  <h2>Manage your Solar Installation</h2>
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
