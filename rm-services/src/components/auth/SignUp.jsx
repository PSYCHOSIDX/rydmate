import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth, db } from "../../firebaseConfig";
import {doc,setDoc} from "firebase/firestore";

import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const SignUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log(userCredential);
        const user = userCredential.user;
        // console.log(user.uid);
        const data = { email: email};
        await setDoc( doc (db, "users", user.uid),data);
        navigate("/verify");
      },error =>{
        console.log(error.message)
      })
  };

  return (
    <div className="sign-in-container">
      <form onSubmit={SignUp}>
        <h1>Create Account</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        ></input><br/>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        ></input><br/>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;