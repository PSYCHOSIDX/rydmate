import React, { useState, useRef, useEffect, } from 'react'
import NavbarLogin from '../components/NavbarLogin';
import NavbarLogout from '../components/NavbarLogout';
import { UserAuth } from '../context/UserAuthContext';
import Footer from '../components/Footer';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import '../components/component-styles/join.css'
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form';
import { useLocation } from 'react-router-dom';
import{useJsApiLoader , Autocomplete } from '@react-google-maps/api'
import { db } from '../firebaseConfig';
import { getDocs,collection, deleteDoc, query, where} from 'firebase/firestore';
import axios from 'axios';
import shortid from 'shortid';
import PaymentSuccess from '../components/PaymentSuccess';
import PaymentFail from '../components/PaymentFail';



const JoinPage = (props) => {

  const axios = require('axios');
  const shortid = require("shortid");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const loc = useLocation();
  const {user} =  UserAuth();
  
  const userId = user.uid;
  var userEmail = user.email;
  console.log(userEmail);

  const data = loc.state?.data;

  const [phone, setPhone] = useState();
  const [location, setLocation]=useState('');
  let [distance, setDistance]= useState('')
  let originRef = data.originStart;


    async function GetPhone(Email)
    {
      console.log(Email)
      const userREF = collection(db, `users/`);
      const q = query(userREF, where('email', '==', Email));
      const querySnapshot = await getDocs(q);
      const phoneList =  querySnapshot.docs.map(doc => doc.data());
      setPhone(phoneList);
  
      console.log(phoneList);
    } 
   
  /**@type React.MutableRefObject<HTMLInputElement>*/
  const destinationRef = useRef()


  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
    libraries:["places"]
  })
  if(!isLoaded){
    return <p style={{textAlign:'center'}}> Loading maps</p>
  }

  function verifyPaymentSignature( razorpay_payment_id, razorpay_signature) {
    var options = {
        method: 'POST',
        url: '/verify-payment-signature',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            razorpay_payment_id: razorpay_payment_id,
            razorpay_signature: razorpay_signature
        }
    };
    axios(options).then(function(response) {
        console.log(response.data);
    }).catch(function(error) {
        console.log(error);
    });
}


 async function calculateRoute(){
  try{
// eslint-disable-next-line no-undef
const directionService = new google.maps.DirectionsService()
const result = await directionService.route({
  origin: originRef ,
  destination: destinationRef.current.value,
  // eslint-disable-next-line no-undef
  travelMode: google.maps.TravelMode.DRIVING
})
setDistance(result.routes[0].legs[0].distance.text)
console.log(distance)
  }
   catch{
    console.log(Error)
   }
 

 }
 const finalCost = parseInt(distance) * parseInt(data.cost_per_seat);

 const handleSubmit = (e) =>{
  e.preventDefault();
  if( finalCost === ""){
    alert('please enter a valid amount');
  } else {
    var options = {
      key: process.env.REACT_APP_RAYZORPAY_KEY_ID ,
      key_secret: process.env.REACT_APP_RAYZORPAY_KEY_SECRET ,
      amount: finalCost*100 ,
      currency:"INR",
      name:"RydMate",
      receipt:'receipt'+shortid.generate() ,
      handler: function(response){
      if(response.razorpay_payment_id){
      console.log('success');
      setSuccess(true);
      } else { console.log('failure');
      setFail(true)
    }
      
      },
      prefill:{
        name: user.displayName,
        email: user.email,
        contact: phone.phoneNumber 
    },
    notes:{
      address: "Razorpay corporate Office",
    },
    theme:{
      color:'#00FFA3'
    }
  };

  var pay = new window.Razorpay(options);
  pay.open()

 } 
}


 return (
    <>
      {user ? <NavbarLogout/> : <NavbarLogin/>}       
     {success? <PaymentSuccess/> : fail? <PaymentFail/> :  <Card  className='car-card' bg='light'>
    <Card.Title className='car-title'> {data.rider_name}</Card.Title>
        <ListGroup.Item> <b style={{marginLeft:10, color:'green'}}> ✅ verified rider</b></ListGroup.Item>
        <br/>
       { !data.vehicle_image ? <h4> Vehicle Image Missing </h4> :<Card.Img variant="top" className='car-image' src={data.vehicle_image} />} 
       
    
      <Card.Body >
      <Form xs="auto" className="sign-form" onSubmit={''}>
      <ListGroup className="list-group-flush">
     
        <ListGroup.Item> <b>From  : </b> {data.start_loc}   </ListGroup.Item>
        <ListGroup.Item> <b>To : </b>  {data.end_loc}   </ListGroup.Item>
        <ListGroup.Item> <b>Cost Per KM : </b>{data.cost_per_seat}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle Name : </b>{data.vehicle_name}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle Type : </b>{data.vtype}</ListGroup.Item>
        <ListGroup.Item> <b>Vehicle No : </b>{data.vnumber}</ListGroup.Item>
        <ListGroup.Item> <b>Seats Available : </b> {data.seats}</ListGroup.Item>
        <ListGroup.Item> <b>Departure Time : </b> {data.departure_time.substring(0,25).replace('T1',' ')}</ListGroup.Item>
        
       
        <Form.Group className="mb-3 none" controlId="formBasicPassword">
        <Autocomplete options={{
                  componentRestrictions: {country : "ind"}
                }}>
          <Form.Control style={{fontSize:12, height:44}} onChange={(e) => setLocation(e.target.value)} type="text"  placeholder="Enter Drop location within route" ref={destinationRef}  required />
          </Autocomplete>
          <Button variant="primary" onClick={() => { GetPhone(userEmail); calculateRoute()}} className='car-pay'> Get Total Cost </Button>
        </Form.Group>
    
  
        { distance ? <ListGroup.Item> <b style={{fontSize : 22}}> Total Cost : {finalCost.toFixed(2) }</b></ListGroup.Item> : null}
        
      </ListGroup>
      {/* <Button variant="primary"  className='car-pay'>  Request To Join </Button> &&  */}
    {distance? <Button onClick={handleSubmit} variant="success"  className='pay'>  Pay </Button>: null}
      
      </Form>
      </Card.Body>
    </Card> }         
   

    <br/>
      <Footer />
    </>
  )
}

export default JoinPage