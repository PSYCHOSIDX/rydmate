import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
// import { useHistory } from "react-router-dom";
import { SignInWithGoogle } from "./SignInWithGoogle";
import { Link } from 'react-router-dom';


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const history = useHistory();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);

        // props.history.push("/verify");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sign-in-container">
      <form onSubmit={signIn}>
        <h1>Log In</h1>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input><br/>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input><br/>
        <button type="submit">Log In</button>
      </form>

      <div className="sign-in-container">
        <button onClick={SignInWithGoogle}>login in with google</button>
    </div>
    <Link to="/signup" className='link'>
            <button className='btn-contact'> sign up </button>
            </Link>
    </div>
    
  );
};

export default SignIn;