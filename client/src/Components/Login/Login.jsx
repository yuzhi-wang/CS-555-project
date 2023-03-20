import React from "react";
import "./Login.styles.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../OAuth/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

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

//   function moveSlider() {
//     let index = this.dataset.value;

//     let currentImage = document.querySelector(`.img-${index}`);
//     images.forEach((img) => img.classList.remove("show"));
//     currentImage.classList.add("show");

//     const textSlider = document.querySelector(".text_group");
//     textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

//     bullets.forEach((bull) => bull.classList.remove("active"));
//     this.classList.add("active");
//   }

//   bullets.forEach((bullet) => {
//     bullet.addEventListener("click", moveSlider);
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
    <main>
    <div class="box">
      <div class="inner_box">
        <div class="forms_wrap">
          <form action="index.html" autocomplete="off" class="sign_in_form">
            <div class="logo">
              <img src="./img/logo.png" alt="easyclass" />
              <h4>easyclass</h4>
            </div>

            <div class="heading">
              <h2>Welcome Back</h2>
              <h6>Not registred yet?</h6>
              <a href="#" class="toggle">
                Sign up
              </a>
            </div>

            <div class="actual_form">
              <div class="input_wrap">
                <input
                  type="text"
                  minlength="4"
                  class="input_field"
                  autocomplete="off"
                  required
                />
                <label>Name</label>
              </div>

              <div class="input_wrap">
                <input
                  type="password"
                  minlength="4"
                  class="input_field"
                  autocomplete="off"
                  required
                />
                <label>Password</label>
              </div>

              <input type="submit" value="Sign In" class="sign_btn" />

              <p class="text">
                Forgotten your password or you login datails?
                <a href="#">Get help</a> signing in
              </p>
            </div>
          </form>

          <form action="index.html" autocomplete="off" class="sign_up_form">
            <div class="logo">
              <img src="./img/logo.png" alt="easyclass" />
              <h4>easyclass</h4>
            </div>

            <div class="heading">
              <h2>Get Started</h2>
              <h6>Already have an account?</h6>
              <a href="#" class="toggle">
                Sign in
              </a>
            </div>

            <div class="actual_form">
              <div class="input_wrap">
                <input
                  type="text"
                  minlength="4"
                  class="input_field"
                  autocomplete="off"
                  required
                />
                <label>Name</label>
              </div>

              <div class="input_wrap">
                <input
                  type="email"
                  class="input_field"
                  autocomplete="off"
                  required
                />
                <label>Email</label>
              </div>

              <div class="input_wrap">
                <input
                  type="password"
                  minlength="4"
                  class="input_field"
                  autocomplete="off"
                  required
                />
                <label>Password</label>
              </div>

              <input type="submit" value="Sign Up" class="sign_btn" />

              <p class="text">
                By signing up, I agree to the
                <a href="#">Terms of Services</a> and
                <a href="#">Privacy Policy</a>
              </p>
            </div>
          </form>
        </div>

        <div class="carousel">
          <div class="images_wrapper">
            <img
              src="client\public\image1.png"
              class="image img-1 show"
              alt=""
            />
            <img src="client\public\image1.png" class="image img-2" alt="" />
            <img src="client\public\image1.png" class="image img-3" alt="" />
          </div>

          <div class="text_slider">
            <div class="text_wrap">
              <div class="text_group">
                <h2>Create your own courses</h2>
                <h2>Customize as you like</h2>
                <h2>Invite students to your class</h2>
              </div>
            </div>

            <div class="bullets">
              <span class="active" data-value="1"></span>
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
