import React, {useState} from "react";
import '../components/component-styles/signpage.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import GoogleButton from "react-google-button"
import NavbarBasic from "../components/NavbarBasic.jsx";
import FormText from "react-bootstrap/esm/FormText.js";
import { Link, useNavigate} from "react-router-dom";
import Alert from 'react-bootstrap/Alert';
import { UserAuth } from "../context/UserAuthContext.js";

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("");
  const [password, setPassword]= useState("");
  const [error, setError] = useState("");
  
  const { signin , googleSignIn} = UserAuth();

    const handleGoogleSignIn = async() =>{
      setError('');
      try{
        await googleSignIn();
        navigate('/');
      } catch(e){
        setError(e.message);
        console.log(e.message);
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      try{
         await signin(email, password);
         navigate('/');
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
    {error &&  <Alert variant="danger" onClose={() => setError(false)} dismissible>
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          {error}
        </p>
      </Alert>}

    <Form xs="auto" className="sign-form" onSubmit={handleSubmit}>
    <h1 className="sign-text"> Login </h1>
      <Form.Group className="mb-3 none" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email"  required/>
      </Form.Group>

      <Form.Group className="mb-3 none" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required/>
      </Form.Group>
    
      <Button size="lg" className="mb-3 sign-btn" type="submit"  >
        submit
      </Button>
      
      <FormText className="mt-3 sign-text-btm" > dont have an account ?<Link to='/signup' className="link"> Sign Up </Link></FormText>
      
      <br/>
      <GoogleButton
      className="google-button"
      onClick={handleGoogleSignIn}
      type="dark"/>

     
    </Form>


    </div>
  
    </div>
  )
}

export default Login

