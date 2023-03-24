import React from 'react'
import '../components/component-styles/search.css'
import  search from '../assets/search-new.svg'

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
                  <button  className='go-btn'> Go </button>
                </div>
                <div className="search-card">
                  <h1>Search <br/> Signup / <br/> Login</h1>
                  <h4>register / login to access services</h4>
                  <button  className='go-btn'> Go </button>
                </div>
                <div className="search-card">
                  <h1>Search <br/> Register In <br/>Rider Program</h1>
                  <h4>Join our program to offer rides</h4>
                  <button className='go-btn'> Go </button>
                </div>

              </div>
            
        </div>
      </div> 
    </>
  )
}

export default Search
