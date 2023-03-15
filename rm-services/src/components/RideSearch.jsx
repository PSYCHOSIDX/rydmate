import React from 'react'
import search from '../assets/search-new.svg'

import './component-styles/ridesearch.css'
const RideSearch = () => {
  return (
    <>
      <div className="search-holder">
        <div className="search-top">
                <img src={search} alt="Search Background"  className='search-img'/>
        </div>

        <div className="search-bottom">
            <h1 className='search-text'>Find Your Next Ride Superfast !</h1>

            <form action="" className='form-holder'>
                <input type="text" placeholder='📍From'  className='phold'/>
                <input type="text" placeholder='📍To' className='phold'/>
                <button type="submit" className='search-btn'>Search</button>
            </form>
        </div>
      </div>


    </>
  )
}

export default RideSearch
