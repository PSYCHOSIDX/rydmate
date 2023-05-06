import React from 'react'
import '../components/component-styles/cardbox.css'
import art1 from '../assets/art (1).png'
import art2 from '../assets/art (2).png'
import art3 from '../assets/art (3).png'

const CardBox = () => {
  return (
    <>

<h1 id="title-stand"> Why Do we Standout ?</h1>
      <br />
    <div className="card-box">

     
     
        <div className="card">
            <h1>Secure</h1>
            <h4>We verify each and every profile to ensure 100% security</h4>
            <img src={art1} alt="secure" className='img1'/>
        </div>
        <div className="card">
            <h1>Low Price </h1>
            <h4>You pay for the exact travelled distances</h4>
            <img src={art2} alt="secure" className='img2' />
        </div>
        <div className="card">
            <h1>Easy To use</h1>
            <h4>Superfast and easy processes from start to end of ride</h4>
            <img src={art3} alt="secure" className='img3' />
        </div>

    </div>
      
    </>
  )
}

export default CardBox
