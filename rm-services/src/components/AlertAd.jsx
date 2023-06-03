import React from 'react'
import '../components/component-styles/alertad.css'
import alert from '../assets/alert.png'
import { Link } from 'react-router-dom'



const AlertAd = () => {
  return (
    <>
      <div className="alert-ad">
        <div className="text">
            <h1>You can Set Up Emergengy Contacts </h1>
            <h4>Safety is our top most priority and we do our best to secure your rides</h4>

            <Link to='/emergency' className='link'> 
            <button className='alert-btn'>Join Us</button>
            </Link>
        </div>

        <img src={alert} alt="Rides !" />
      </div>
    </>
  )
}

export default AlertAd
