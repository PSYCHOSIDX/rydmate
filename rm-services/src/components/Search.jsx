import React from 'react'
import '../components/component-styles/search.css'
import  search from '../assets/search-new.svg'
import {Link} from 'react-router-dom'



const Search = () => {

  return (
    <>
      <div className="search-holder">
        <div className="search-top">
                <img src={search} alt="Search Background"  className='search-img'/>
        </div>

        <div className="search-bottom">
            <h1 className='search-text'>Find Your Next Ride Superfast !</h1>
              <div className="card-holder">

                <div className="search-card">
                  <h1>Search <br/> Rides</h1>
                  <h4>Find rides quick at best  prices</h4>
                  <Link className='link' to='/rides'>
                  <button  className='go-btn'> Go </button>
                  </Link>
                </div>
                <div className="search-card">
                  <h1>Signup / <br/> Login</h1>
                  <h4>register / login to access services</h4>
                  <Link className='link' to='/login'>
                  <button  className='go-btn'> Go </button>
                  </Link>
                </div>
                <div className="search-card">
                  <h1> Register In <br/>Rider Program</h1>
                  <h4>Join our program to offer rides</h4>
                  <Link className='link' to='/join'>
                  <button className='go-btn'> Go </button>
                  </Link>
                </div>

              </div>
            
        </div>
      </div> 
    </>
  )
}

export default Search
