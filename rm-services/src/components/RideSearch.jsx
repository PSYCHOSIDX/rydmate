import React from 'react'
import search from '../assets/search-new.svg'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import './component-styles/ridesearch.css'


const RideSearch = () => {
    const start ="Margao";
    const dest="Panjim";
    const distance = 29;
    const vtype ="Suv"
    const cost = 12
    const seats = 2
    const name = "Michale Jackson"

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

      <div className="ride-results">
        <div className="ride-head">
            <h2>Rides Found</h2>

        <DropdownButton id="dropdown-basic-button" title="Sort By:Default">
            <Dropdown.Item href="#/action-1">Cost : low to high</Dropdown.Item>
            <Dropdown.Item href="#/action-2">cost : high to  low</Dropdown.Item>
            <Dropdown.Item href="#/action-3">vehicle type</Dropdown.Item>
        </DropdownButton>
         
        </div>
      </div>



{/* card holder and data */}



      <div className="card-results">

    <Container className='gridbox'>
      <Row text-center className='gridrow'>
      <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>

                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>

                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>

                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>


                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>

                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>


                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>


                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>

                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>

                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>

                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>


                
                <div className="ride-card">
                    <h2 id="loc">{start} to {dest}</h2>
                      <h5 id="dis">Distance {distance} km</h5>
                      <div className="line"> .</div>

                      <h2 id="name">{name}</h2>
                      <h2 className='type'>Vehicle type </h2>
                      <h3 id='type'>{vtype}</h3>

                      <h2 id='seat'>Seats Available {seats}</h2>

                      <h5 id='cost'>Cost Per Km</h5>
                      <h2 id='realcost'>{cost}</h2>

                      <input type="button" value='Join' className='ride-join'/>
                </div>
      </Row>
    </Container>

 
        </div>



    </>
  )
}

export default RideSearch
