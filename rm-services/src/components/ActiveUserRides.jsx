import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import './component-styles/ridesearch.css';
import { db } from '../firebaseConfig';
import { collection, getDoc, getDocs, query,deleteDoc, where, doc, updateDoc , addDoc, setDoc} from 'firebase/firestore';
import { UserAuth } from '../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import shortid from "shortid";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ActiveUserRides = () => {
  const authContext = UserAuth();
  const currentUserUid = authContext.user && authContext.user.uid;
  const {user} =  UserAuth();
  const userId = user.uid;
  const [reward, setReward] = useState(false);
  const [rides, setRides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ridesPostedExists, setRidesPostedExists] = useState(true);

  // const [rideID,setRideID]= useState();
  let rideID;
  let riderID;
  let realCredit;
  const [finalCost, setCost]= useState();
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [rejectedRide, setRejectedRide] = useState(null);

  const [credit, setCredit] = useState([]);
  const [cancelledRides, setCancelledRides] = useState([]);

  const shortid = require('shortid');

  const navigate = useNavigate();

  const handlePayment = (e) =>{
    
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
        creditUpdate();
        rewardHistory();
        alert("Payment Success");
        } else { console.log('failure');
        alert("Payment Failure")
      }
        
        },
        prefill:{
          name: user.displayName,
          email: user.email,
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



  const rewardHistory = async (e) => {
    try {
      await addDoc(collection(db, "users/"+riderID+'/rewards'), {
        amount: finalCost + price,
        customer_user_id : userId,
        payment_status: "success",
        ride_id : rideID
      });
    
    } catch (error) {
      console.log(error.message);
    }
 
  }
  

  
  const creditUpdate = async (e) => {
  
    const userDetailsRef = doc(db, 'users', riderID,'available_credits','credits' );
    const userDetailsDoc = await getDoc(userDetailsRef);

   
     try{
      if (userDetailsDoc.exists()) {
        // Update existing document
        console.log('triggered update')
        await updateDoc(userDetailsRef, {
          main_credit: price + finalCost ,
        });
      } else {
        // Create new document
        console.log('triggered setdoc')
        await setDoc(userDetailsRef, {
          main_credit:finalCost,
        });
      }
     } catch(error){
      alert(error)
     }
     
    
  };




  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        // Retrieve the acceptance status from the user's document in Firestore
        const userRef = doc(db, 'users', currentUserUid, 'details', currentUserUid); 
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          const { request_accepted, ride_id } = userData;
          
          if (request_accepted && ride_id) {

            setAcceptedRide(ride_id);
            const rideRef = doc(db, 'rides', ride_id); 
            const rideDoc = await getDoc(rideRef);
            const rideData = rideDoc.data();
            
            toast.success(`Your request for the ride from ${rideData.start_loc} to ${rideData.end_loc} has been accepted!`);
          }

          await updateDoc(userRef, { request_accepted: false, ride_id: '' });

          const { request_rejected, rejected_ride_id } = userData;
          if (request_rejected && rejected_ride_id) {

            setRejectedRide(rejected_ride_id);
            const rideRef = doc(db, 'rides', rejected_ride_id); 
            const rideDoc = await getDoc(rideRef);
            const rideData = rideDoc.data();
            
            toast.success(`Your request for the ride from ${rideData.start_loc} to ${rideData.end_loc} has been rejected!`);
          }

          await updateDoc(userRef, { request_rejected: false, rejected_ride_id: '' });

          const { request_ride_cancelled, cancelled_ride_id } = userData;
          if (request_ride_cancelled && cancelled_ride_id) {

            setRejectedRide(cancelled_ride_id);
            const rideRef = doc(db, 'rides', cancelled_ride_id); 
            const rideDoc = await getDoc(rideRef);
            const rideData = rideDoc.data();
            
            toast.success(`The carpool from ${rideData.start_loc} to ${rideData.end_loc} has been cancelled!`);
          }

          await updateDoc(userRef, { request_ride_cancelled: false, cancelled_ride_id: '' });

        }
      } catch (error) {
        console.error('Error retrieving request status:', error);
      }
    };

    checkRequestStatus();
  }, [currentUserUid]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        if (!currentUserUid) {
            setIsLoading(false);
            return;
          }

        const carpoolsJoinedRef = collection(db,'users', currentUserUid, 'CarpoolsJoined');
        const querySnapshot = await getDocs(carpoolsJoinedRef);
        if (querySnapshot.empty) {
            setRidesPostedExists(false);
          }else {
        const rideIds = querySnapshot.docs.map((doc) => doc.data().ride_id);
        const ridesRef = collection(db, 'rides');
        const q = query(ridesRef, where('ride_id', 'in', rideIds));
        const qq = query(q, where('ride_status', '==', 'active'));

        const ridesSnapshot = await getDocs(qq);
        const ridesData = ridesSnapshot.docs.map((doc) => doc.data());
        // console.log('Rides data:', ridesData);
        setRides(ridesData);
        
          }
          setIsLoading(false);
      }catch(error){
        alert(" Error Loading");
      }
    };
         

    fetchRides();
  }, [currentUserUid]);


  



  useEffect( ()=>{
   
    const getJoin =  async ()=> {
      

      const requestDocRef = doc(db, `rides/${rideID}/UsersJoined/${userId}`);
      const requestDocSnap = await getDoc(requestDocRef);

      const requestDocData = requestDocSnap.data();
      const joinData = { ...requestDocData, id: requestDocSnap.id };
      setCost(joinData.cost);
     
    }
       
    getJoin();
  }, );




  useEffect(() => {
    const fetchData = async () => {
      
      const creditCollection = collection(db,'users/'+riderID+'/available_credits/');
      const creditSnapshot = await getDocs(creditCollection);
      const creditList = creditSnapshot.docs.map(doc => doc.data());
      setCredit(creditList);
    };

    fetchData();
  });
  var  price;
credit.map((c)=>{
 price= c.main_credit;
 
})








useEffect(() => {
  
    const fetchData = async () => {
    
      try { 
      const rewardCollection = collection(db,'users/'+riderID+'/rewards');
      const q = query(rewardCollection,where("ride_id", "==", rideID));
      const qmain = query(q,where("customer_user_id", "==", userId));
      const rewardSnapshot = await getDocs(qmain);
      const rewardList = rewardSnapshot.docs.map(doc => doc.data());
      setReward(rewardList);
    }
  catch(error){
      console.log(error)
    }
  
    fetchData();
  
    }
});


  const handlePhoneCall = (contact) => {
    window.location.href = `tel:${contact}`;
  };

  if (isLoading) {
    return <p>Loading Carpools...</p>;
  }
    
  const handleCancelRide = async (rideID) => {
    try {
     
const userRef = doc(db, 'rides', rideID,'UsersJoined', userId);
// Increment the seats_requested in the rides collection by 1
const userDoc = await getDoc(userRef);
const userData = userDoc.data();
console.log(userData);
const req_seats = parseInt(userData.seats, 10) || 0;
console.log(req_seats)
 
const rideRef = doc(db, 'rides', rideID);
// Increment the seats_requested in the rides collection by 1
const rideDoc = await getDoc(rideRef);
const rideData = rideDoc.data();
const ride_user_id = rideData.user_id;
const seats_present = parseInt(rideData.seats, 10) || 0;
console.log(seats_present)
await updateDoc(rideRef, { seats: seats_present + req_seats});

      const userJoinedRef = doc(db, `rides/${rideID}/UsersJoined/${userId}`);
      await deleteDoc(userJoinedRef);
  
    const carpoolsJoinedRef = doc(db, `users/${userId}/CarpoolsJoined/${rideID}`);
    await deleteDoc(carpoolsJoinedRef);


    alert(`You have successfully left the ride.`);
    const userRef1 = doc(db, 'users', ride_user_id, 'details', ride_user_id);
    const userRef2 = await getDoc(userRef1);
    if (userRef2.exists()) {

      await updateDoc(userRef1, {
        user_ride_cancelled: true,
        user_cancel:user.displayName,
    user_cancelled_rideid: rideID});
    } else {

      await setDoc(userRef1, {
        user_ride_cancelled: true,
        user_cancel:user.displayName,
    user_cancelled_rideid: rideID});

    }
    window.location.href = '/viewrides';
    } catch (error) {
   
      console.error('Error leaving the ride:', error);
      alert('An error occurred while leaving the ride. Please try again later.');
    }
  };
  

 // Disable the cancel button if the remaining time is less than 2 hours
const disableCancelButton = (ride) => {
  if (!ride || !ride.departure_time) {
    return false;
  }

  const currentTime = new Date();
  const departureTime = new Date(ride.departure_time);
  const timeDifference = departureTime.getTime() - currentTime.getTime();
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));

  return hoursDifference < 2;
};

  

  return (
    <>

{rides.map((ridex)=>
    {
      rideID=ridex.ride_id;
    
      riderID=ridex.user_id;


    })}
   
      <div className="ride-results">
        <div className="ride-head">
          <h2 > 
              Active Carpools</h2>
        </div>
      </div>

      <div className="card-results">
        {rides.length === 0 ? (
          <h2>No active carpools currently.
            <Link to="/rides" className='link'>
           search for a ride 
          </Link></h2>
        ) : (
          <Container className="gridbox">
            <Row className="gridrow">
         

        

            {rides.map((ride) => (
          
               <div key={ride.ride_id }  className="ride-card">
               <h2 id="loc">
               <b> From : </b> {ride.start_loc} <br /> <b> To :</b> {ride.end_loc}
                   </h2>
                   <input
        type="button"
        style={{ color: 'white', borderRadius: '0.5rem', backgroundColor: '#025b02',border:'0', marginLeft: '70%',  marginBottom:'2%' }}
        disabled={disableCancelButton(ride)}
        onClick={() => handleCancelRide(ride.ride_id)}
        value="leave Ride"
      />
                   <div className="line"> </div>

                   <h2 className="type">Vehicle name</h2>
                   <h2 id="type">{ride.vehicle_name}</h2>
                   <h2 className="type">Vehicle type</h2>
                   <h3 id="type">{ride.vehicle_type}</h3>
                   <h2 className="type">Vehicle No</h2>
                   <h3 id="type">{ride.vehicle_number}</h3>
                   <h2 className="type">Departure Time</h2>
                   <h3 id="type">{ride.departure_time.substring(0,35).replace('T',' ')}</h3>
                   {/* <h2 className="type">Ride Status</h2>
                   <h3 id="type">{ride.ride_status}</h3> */}
                  

                   <div className="line" style={{backgroundColor: 'black' }}> </div>

                   <h2 id="type">pickup otp: {ride.ride_otp}</h2>
                   <h2 id="type">drop otp: {ride.drop_otp}</h2>

                   <input type="button" value={'☏ '+ride.rider_contact} onClick={() => handlePhoneCall(ride.rider_contact)} className="payPhone"/>
                  { reward? <h1 id="type" className='m-2'> Payment Successful </h1> : <input type="button"  onClick={handlePayment} value="Pay" className="pay"/>}
                
                </div>     
 
      ))}
      </Row>
          </Container>
        )}
      </div>
      {/* {acceptedRide && <p>Your request for Ride ID {acceptedRide} has been accepted!</p>} */}
      <ToastContainer />
    </>
  );
};

export default ActiveUserRides;
