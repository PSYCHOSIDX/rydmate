import React from 'react'
import NavbarLogin from '../components/NavbarLogin'
import Footer from '../components/Footer'
import RideSearch from '../components/RideSearch'
import { UserAuth } from '../context/UserAuthContext'
import NavbarLogout from '../components/NavbarLogout'
const Rides = () => {
  const {user} = UserAuth();
  return (
    <>
    {user ? <NavbarLogout/> : <NavbarLogin/>}
    <RideSearch/>
    <Footer/>
    </>
  )
}

export default Rides
