import React from "react";
import '../components/component-styles/signpage.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GoogleButton from "react-google-button"
import NavbarBasic from "../components/NavbarBasic.jsx";
import FormText from "react-bootstrap/esm/FormText.js";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    
    <div className="main-sign">
    <NavbarBasic id="nx"/>
    <div className="sign-holder">
           

    <Form xs="auto" className="sign-form">
    <h1 className="sign-text"> Login </h1>
      <Form.Group className="mb-3 none" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3 none" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
    
      <Button size="lg" className="mb-3 sign-btn" type="submit"  >
        submit
      </Button>
      
      <FormText className="mt-3 sign-text-btm" > dont have an account ?<Link to='/signup' className="link"> Sign Up </Link></FormText>
      
      <br/>
      <GoogleButton
      className="google-button"
      type="dark"/>

     
    </Form>


    </div>
  
    </div>
  )
}

export default Login

