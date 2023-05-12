import React, { useState } from "react";
import '../components/component-styles/signpage.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import NavbarBasic from "../components/NavbarBasic.jsx";
import FormText from "react-bootstrap/esm/FormText.js";
import { Link , useNavigate} from "react-router-dom";
import { UserAuth } from "../context/UserAuthContext.js";
import Alert from 'react-bootstrap/Alert';



const SignUp = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword]= useState("");
  const [displayName, setDisplayName]= useState("");
  const [error, setError] = useState("");
  const [phoneNo, setPhoneNo]= useState("");
  
  const { createUser } = UserAuth();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try{
         await createUser(email, password, displayName, phoneNo);
         navigate('/login')
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
          {error &&  <Alert variant="danger" onClose={() => setError(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          {error}
        </p>
      </Alert>}

        <Form xs="auto" className="sign-form" onSubmit={handleSubmit}>
          
              <h1 className="sign-text"> Sign Up </h1>

              <Form.Group className="mb-3 none" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={(e) => setDisplayName(e.target.value)} type="name" placeholder="Enter Name" required/>
                  </Form.Group>
                  <Form.Group className="mb-3 none" controlId="formBasicPassword">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control onChange={(e) => setPhoneNo(e.target.value)} type="tel" name="phoneNumber" id="phoneNumber"  pattern="[0-9]{10}" placeholder="Enter Phone Number " required />
                  </Form.Group>
                  <Form.Group className="mb-3 none" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter Email" required/>
                  </Form.Group>

                  <Form.Group className="mb-3 none" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Password" required />
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