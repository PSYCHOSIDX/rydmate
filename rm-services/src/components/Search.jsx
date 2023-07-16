import React, { useState, useEffect } from 'react';
import '../components/component-styles/search.css'
import search from '../assets/search-new.svg'
import { Link, useNavigate} from 'react-router-dom'
import { collection, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserAuth } from '../context/UserAuthContext';
import { FaBell } from 'react-icons/fa';

const Search = () => {
  const authContext = UserAuth();
  const isLoggedIn = authContext.user !== null; // Check if user is logged in
  const currentUserUid = authContext.user ? authContext.user.uid : null;
  const [isVerifiedUser, setIsVerifiedUser] = useState(false);
  const [hasRiderProgram, setHasRiderProgram] = useState(false);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        if (currentUserUid) {
          const riderInfoCollectionRef = collection(db, 'users', currentUserUid, 'riderprogram', currentUserUid, 'riderinfo');
          const riderInfoSnapshot = await getDocs(riderInfoCollectionRef);

          if (!riderInfoSnapshot.empty) {
            const userData = riderInfoSnapshot.docs[0].data();
            const isVerified = userData?.verified_rider || false;
            setIsVerifiedUser(isVerified);
            console.log(isVerified);
            setHasRiderProgram(true);
          }
          else {
            setHasRiderProgram(false);
          }
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
      }
    };

    fetchVerificationStatus();
  }, [currentUserUid]);

  const [requestAccepted, setRequestAccepted] = useState(false);
  const [requestReceived, setRequestReceived] = useState(false);

  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        if (currentUserUid) {
          const userRef = doc(db, 'users', currentUserUid,'details',currentUserUid);
          const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          
          // Retrieve the request_accepted status from the user's document in Firestore
        // const userRef = doc(db, 'users', currentUserUid); 
        const userDoc = await getDoc(userRef);
          const userData = userDoc.data();

          if (userData && Object.prototype.hasOwnProperty.call(userData, 'request_accepted')) {
            const { request_accepted } = userData;

            if (typeof request_accepted === 'boolean') {
              setRequestAccepted(request_accepted);
            } else {
              console.log('Invalid request_accepted value:', request_accepted);
            }
          } else {
            console.log('request_accepted field is missing in the user document');
          }
          if (userData && Object.prototype.hasOwnProperty.call(userData, 'request_received')) {
            const { request_received } = userData;

            if (typeof request_received === 'boolean') {
              setRequestReceived(request_received);
            } else {
              console.log('Invalid request_accepted value:', request_received);
            }
          } else {
            console.log('request_accepted field is missing in the user document');
          }

        }else {
          console.log('User document not found');
        }
      }
    } catch (error) {
      console.error('Error retrieving request status:', error);
    }
  };


    checkRequestStatus();
  }, [currentUserUid]);

  
  const handleJoinRide = async () => {
    const userDetailsRef = doc(db, 'users', currentUserUid, 'details', currentUserUid);
    const userDetailsDoc = await getDoc(userDetailsRef);

      if (userDetailsDoc.exists() && userDetailsDoc.data().phoneNumber) {
          navigate('/rides')     
      
      } else {
        // Phone number does not exist in user's details
        alert('Please update your contact number in the profile before joining a ride.');
      }
    };



  return (
    <>
      <div className="search-holder">
        <div className="search-top">
          <img src={search} alt="Search Background" className='search-img' />
        </div>
        <div className="search-bottom">
          <h1 className='search-text'>Find Your Next Ride Superfast!</h1>
          <div className="card-holder">
            <div className="search-card">
              <h1>Search <br /> Rides</h1>
              <h4>Find rides quickly at the best prices</h4>
              {/* <Link className='link' to='/rides'> */}
                <button className='go-btn' onClick={handleJoinRide}>Go</button>
              {/* </Link> */}
            </div>

            <div className="search-card">
              {isLoggedIn ? (
                <>
                  <h1>View <br /> Rides</h1>
                  <h4>View all the rides you joined till now</h4>
                  <Link className='link' to='/viewrides'>
  <button className='go-btn'>Go  {requestAccepted && <FaBell className="notification-icon" style={{ color: 'red' , fontSize: '24px' }} />} {/* Render the notification icon if request_accepted is true */}
</button>                                    

                  </Link>

                </>
              ) : (
                <>
                  <h1>Signup / <br /> Login</h1>
                  <h4>Register / Login to access services</h4>
                  <Link className='link' to='/login'>
                    <button className='go-btn'>Go</button>
                  </Link>
                </>
              )}
            </div>



            <div className="search-card">
            {isLoggedIn ? (
                <>
                  {hasRiderProgram ? (
                    <>
                      {isVerifiedUser ? (
                        <>
                          <h1>Rider Program</h1>
                          <h4>Start posting rides or view active ones</h4>
                          <div className="button-container">
                          <Link className="link" to="/postride" style={{ marginRight: '10px' }}>
  <button className="go-btn" style={{ fontSize: '12px', padding: '5px 10px' }}>
    Post Rides
  </button>
</Link>
<Link className="link" to="/vehicleinfo" style={{ marginRight: '10px' }}>
  <button className="go-btn" style={{ fontSize: '12px', padding: '5px 10px' }}>
    Add vehicle
  </button>
</Link>

                            <br />
                            <br />
                            <Link className="link" to="/activerides">
                              <button className="go-btn">View Rides  {requestReceived && <FaBell className="notification-icon" style={{ color: 'red' , fontSize: '24px' }}/>}</button>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <h1>Rider Program</h1>
                          <h4>You're yet to be verified</h4>
                          <button className="go-btn" disabled>
                            Verification pending
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <h1>Register for <br/>  Rider Program</h1>
                      <h4>Join our program to offer rides</h4>
                      <Link className="link" to="/riderinfo">
                        <button className="go-btn">Go</button>
                      </Link>
                    </>
                  )}
                </>
              ) : (
                <>
                  <h1>Register for <br/> Rider Program</h1>
                  <h4>Join our program to offer rides</h4>
                  <Link className="link" to="/riderinfo">
                    <button className="go-btn">Go</button>
                  </Link>
                </>
              )}
            </div>

            {/* <div className="search-card">
              {isVerifiedUser ? (
                <>
                  <h1>Rider Program</h1>
                  <h4>Start posting rides or view active ones</h4>
                  <div className="button-container">
                    <Link className='link' to='/postride'>
                      <button className='go-btn'>Post Rides</button>
                    </Link>
                    <br/>
                    <br/>
                    <Link className='link' to='/activerides'>
                      <button className='go-btn'>View Rides</button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h1>Register In <br />Rider Program</h1>
                  <h4>Verification pending</h4>
                  <Link className='link' to='/riderinfo'>
                    <button className='go-btn' disabled>Go</button>
                  </Link>
                </>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Search;
