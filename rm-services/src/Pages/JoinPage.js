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
import { UNSAFE_useRouteId, useLocation } from 'react-router-dom';
import{useJsApiLoader , Autocomplete } from '@react-google-maps/api'
import { db } from '../firebaseConfig';
import { getDocs,getDoc, collection, doc, query, where,setDoc, updateDoc} from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
// import PaymentSuccess from '../components/PaymentSuccess';
// import PaymentFail from '../components/PaymentFail';



const JoinPage = (props) => {

  const navigate = useNavigate();

  // const [success, setSuccess] = useState(false);
  // const [fail, setFail] = useState(false);

  const loc = useLocation();
  const {user} =  UserAuth();
  
  const userId = user.uid;
  const userName = user.displayName;

  var userEmail = user.email;
  const destinationRef = useRef();

  const data = loc.state?.data;
  
  const rideID = data.ride_id;
  const rideOTP = data.otp;
  const dropOTP =  data.dropotp;
  const ridersuserId = data.riders_user_id;

  const drop_off = data.drop_off;
  const pick_up = data.pick_up;
// console.log(drop_off)
// console.log(pick_up)
const [pickup_lat, pickup_lng] = pick_up;

const [dropoff_lat, dropoff_lng] = drop_off;

console.log('Pickup Lat:', pickup_lat);
console.log('Pickup Lng:', pickup_lng);
console.log('Dropoff Lat:', dropoff_lat);
console.log('Dropoff Lng:', dropoff_lng);
  const [bookSeat, setBookSeat] = useState('');
  const [phone, setPhone] = useState();
  const [dropLocation, setDropLocation]= useState();
  const [joinData, setJoinData] = useState([]);

  const [status, setStatus]=useState('');

  let [distance, setDistance]= useState('')
  let originRef = data.originStart;
  

  useEffect( ()=>{
   
    const getJoin =  async ()=> {
      console.log(userId)

      const requestDocRef = doc(db, `rides/${rideID}/UsersJoined/${userId}`);
      const requestDocSnap = await getDoc(requestDocRef);

      if (requestDocSnap.exists()) {
        const requestDocData = requestDocSnap.data();
      const joinData = { ...requestDocData, id: requestDocSnap.id };
      setStatus(joinData.carpool_status);
          } else {
        console.log('Document does not exist');
      }
    }
      
      
      // const q = query(requestCollection, where("user_id", "==", userId),where("ride_id", "==", rideID) );
      //   const dbdata = await getDocs(q);
      //   setJoinData(dbdata.docs.map((doc) => ({ ...doc.data(), id:doc.id})));
      //   joinData.map(((data) => (setStatus(data.carpool_status))));
    
  
    getJoin();
  }, []);
    



    async function GetPhone(Email)
    {
      const userREF = collection(db, `users/`);
      const q = query(userREF, where('email', '==', Email));
      const querySnapshot = await getDocs(q);
      const phoneList =  querySnapshot.docs.map(doc => doc.data());
      setPhone(phoneList);
  
    } 
   
  


  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GMAPS_KEY,
    libraries:["places"]
  })
  if(!isLoaded){
    return <p style={{textAlign:'center'}}> Loading maps</p>
  }

//   function verifyPaymentSignature( razorpay_payment_id, razorpay_signature) {
//     var options = {
//         method: 'POST',
//         url: '/verify-payment-signature',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         data: {
//             razorpay_payment_id: razorpay_payment_id,
//             razorpay_signature: razorpay_signature
//         }
//     };
//     axios(options).then(function(response) {
//         console.log(response.data);
//     }).catch(function(error) {
//         console.log(error);
//     });
// }


 async function calculateRoute(){
  try{
// eslint-disable-next-line no-undef
const directionService = new google.maps.DirectionsService()
const result = await directionService.route({
  origin: originRef ,
  destination: destinationRef.current.value,
  // eslint-disable-next-line no-undef
  travelMode: google.maps.TravelMode.DRIVING,
  
})
setDistance(result.routes[0].legs[0].distance.text)

  }
   catch{
    
   }
 

 }
 const finalCost =parseInt(bookSeat) * (parseInt(distance) * parseInt(data.cost_per_seat));

 function validateSeats(bookSeat){
  if (bookSeat>data.seats){
    alert('Inavlid Input , Please enter seats within limits');
    setDistance=null
  }
 }

 
 

const startLoc = data.start_loc;

 const joinRequest = async (e) => {

  e.preventDefault();
if(data.seats>= bookSeat){
  
  try{
    const usersJoinedRef = doc(db, 'rides', rideID, 'UsersJoined', userId);
    await setDoc(usersJoinedRef, {
      carpool_status :"pending",
      driver_info:"pick up",
      // end_loc: destinationRef.current.value,
      ride_id: rideID,
      seats: bookSeat,
      // start_loc: startLoc,
      user_id: userId,
      user_name: userName,
      cost: finalCost,
      drop_distance: distance,
      drop_otp: dropOTP,
      ride_otp: rideOTP,
      pickup_lng: pickup_lng,//'73.9559',
      pickup_lat: pickup_lat,//'15.2560',
      dropoff_lat: dropoff_lat,//'15.4989',
      dropoff_lng: dropoff_lng//'73.8278' 
    });

    alert('Request Added successfuly')
    
    const userRef1 = doc(db, 'users', ridersuserId, 'details', ridersuserId);
    const userRef2 = await getDoc(userRef1);
    if (userRef2.exists()) {

      await updateDoc(userRef1, {
        request_received: true,
      user_ride:rideID});
    } else {

      await setDoc(userRef1, {
        request_received: true,
        user_ride:rideID});

    }

    navigate('/rides');

  } catch (error) {
    console.log(error.message);
    alert('Error in Requesting !')
  }
}
else{ alert('Please Enter seats within available vacancy')}

}
//  const handleSubmit = (e) =>{
//   e.preventDefault();
//   if( finalCost === ""){
//     alert('please enter a valid amount');
//   } else {
//     var options = {
//       key: process.env.REACT_APP_RAYZORPAY_KEY_ID ,
//       key_secret: process.env.REACT_APP_RAYZORPAY_KEY_SECRET ,
//       amount: finalCost*100 ,
//       currency:"INR",
//       name:"RydMate",
//       receipt:'receipt'+shortid.generate() ,
//       handler: function(response){
//       if(response.razorpay_payment_id){
//       console.log('success');
//       setSuccess(true);
//       } else { console.log('failure');
//       setFail(true)
//     }
      
//       },
//       prefill:{
//         name: user.displayName,
//         email: user.email,
//         contact: phone.phoneNumber 
//     },
//     notes:{
//       address: "Razorpay corporate Office",
//     },
//     theme:{
//       color:'#00FFA3'
//     }
//   };

//   var pay = new window.Razorpay(options);
//   pay.open()

//  } 
// }

const handleViewMap = async () => {
  try {
    // const response = await axios.get(`/api/navigation?rideId=${data.id}`);
    // const { latitude, longitude } = response.data.coordinates;
    // history.push(`/navigation?lat=${latitude}&lng=${longitude}`);

    navigate('/navigation', {
      state: {
        data: {
          start_loc: data.start_loc,
          end_loc: data.end_loc,
          pickup_lng: pickup_lng,
          pickup_lat: pickup_lat,
          dropoff_lat: dropoff_lat,
          dropoff_lng: dropoff_lng,
        },
      },
    });
  } catch (error) {
    console.log('Error:', error);
  }
};

 return (
    <>
      {user ? <NavbarLogout/> : <NavbarLogin/>}  
      
      
     {/* {success? <PaymentSuccess/> : fail? <PaymentFail/> :   */}
      {status==='pending'? 
      <div className='pending'> 
      <h1>Request is Pending</h1>
      <Link className='link' to='/rides'> 
      <button> Go To Rides Page </button>
      </Link>
      
      </div> : status==='rejected'? <div className='pending'> 
      <h1>Request is Rejected</h1>
      <Link className='link' to='/rides'>
      <button> Go To Rides Page </button>
      </Link>
      
      </div> :status==='accepted'?<div className='pending'> 
      <h1>Request is Accepted</h1>
      <Link className='link' to='/viewrides'>
      <button > Go To Active Rides </button>
      </Link>
      
      </div> :
     <Card  className='car-card' bg='light'>
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
        <ListGroup.Item> <b>Departure Time : </b> {data.departure_time.substring(0,25).replace('T',' ')}</ListGroup.Item>
        
    <Button variant="success" onClick={handleViewMap} className='pay'>View Map</Button>

        <Form.Group className="mb-3 none" controlId="formBasicPassword">
       
        <Autocomplete  onChange={(e) => {setDropLocation(e.target.value)}} options={{
                  componentRestrictions: {country : "ind"}
                }}
                >
                   <Form.Control style={{fontSize:12, height:44, margin:'.1rem'}} type="text" placeholder='📍drop location' autoComplete='on'  ref={destinationRef} onChange={(e)=>setDropLocation(e.target.value)}/>
                </Autocomplete>


          <Form.Control style={{fontSize:12, height:44}} onChange={(e) => setBookSeat(e.target.value )} type="number"  placeholder="Enter No of Seats" max={data.seats}required />
          <Button variant="primary" onClick={() => { GetPhone(userEmail); calculateRoute(); validateSeats(bookSeat)}} className='car-pay'> Get Total Cost </Button>
        </Form.Group>
    
  
  
        { distance ? <ListGroup.Item> <b style={{fontSize : 22}}> Total Cost : {finalCost.toFixed(2) }</b></ListGroup.Item> : null}
        
      </ListGroup>
      {/* <Button variant="primary"  className='car-pay'>  Request To Join </Button> &&  */}
    {/* {distance? <Button onClick={handleSubmit} variant="success"  className='pay'>  Pay </Button>: null} */}
      {distance? <Button variant="success"  className='pay' onClick={joinRequest}>  Request To Join </Button>: null}
      </Form>
      </Card.Body>
    </Card> } 



    <br/>
    

  
      <Footer />
    </>
  )
}

export default JoinPage