import React from 'react'
import car from '../assets/car.png'
import '../components/component-styles/carad.css'


const OfferAd = () => {
  return (
    <>
      <div className="offer-ad">
        <div className="text">
            <h1>Want To Offer Rides ?</h1>
            <h4>Easy and fast hassle free </h4>
            <button className='offer-btn'>Enroll</button>
        </div>

        <img src={car} alt="Rides !" />
      </div>
    </>
  )
}

export default OfferAd
