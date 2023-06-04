import React, { useState, useEffect } from 'react';
import '../components/component-styles/search.css'
import search from '../assets/search-new.svg'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserAuth } from '../context/UserAuthContext';

const Search = () => {
  const authContext = UserAuth();
  const isLoggedIn = authContext.user !== null; // Check if user is logged in
  const currentUserUid = authContext.user ? authContext.user.uid : null;
  const [isVerifiedUser, setIsVerifiedUser] = useState(false);

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
          }
        }
      } catch (error) {
        console.error('Error fetching verification status:', error);
      }
    };

    fetchVerificationStatus();
  }, [currentUserUid]);

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
              <Link className='link' to='/rides'>
                <button className='go-btn'>Go</button>
              </Link>
            </div>

            <div className="search-card">
              {isLoggedIn ? (
                <>
                  <h1>View <br /> Rides</h1>
                  <h4>View all the rides you joined till now</h4>
                  <Link className='link' to='#'>
                    <button className='go-btn'>Go</button>
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
                  <h4>Join our program to offer rides</h4>
                  <Link className='link' to='/riderinfo'>
                    <button className='go-btn'>Go</button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search;
