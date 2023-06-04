import React from 'react'
import NavbarLogin from '../components/NavbarLogin'
import Footer from '../components/Footer'
import { UserAuth } from '../context/UserAuthContext'
import RideDetails from '../components/RideDetails'
import NavbarLogout from '../components/NavbarLogout'

const RidesUsers = () => {
  const {user} = UserAuth();
  return (
    <>
    {/* {user ? <NavbarLogout/> : <NavbarLogin/>} */}
    <RideDetails/>
    {/* <ActiveRides/> */}
    {/* <Footer/> */}
    </>
  )
}

export default RidesUsers
