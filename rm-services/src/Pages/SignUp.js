import React, { useState } from "react";
import '../components/component-styles/signpage.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavbarBasic from "../components/NavbarBasic.jsx";
import FormText from "react-bootstrap/esm/FormText.js";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/UserAuthContext.js";

const SignUp = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword]= useState("");
  const [error, setError] = useState("");
  
  const { createUser } = UserAuth();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try{
         await createUser(email, password);
      } 
      catch(e){
        setError(e.message);
        console.log(e.message);
      }
    };


  return (

    <div className="main-sign">
    <NavbarBasic id="nx"/>

        <div className="sign-holder">
        {/* {error && <Alert variant="danger"> {error}</Alert>}  */}

        <Form xs="auto" className="sign-form" onSubmit={handleSubmit}>
          
              <h1 className="sign-text"> Sign Up </h1>

                  <Form.Group className="mb-3 none" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
                  </Form.Group>

                  <Form.Group className="mb-3 none" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
                  </Form.Group>
            
                  <Button size="lg" className="mb-3 sign-btn" type="submit"  >
                    submit
                  </Button>

              <FormText className="mt-3 sign-text-btm" > already have an account ? <Link to="/login" className="link">Login</Link></FormText>
              
        </Form>


        </div>
  
    </div>
   
  )
  }

export default SignUp ;