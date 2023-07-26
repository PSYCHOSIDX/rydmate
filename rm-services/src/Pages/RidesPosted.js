import React from 'react'
import NavbarLogin from '../components/NavbarLogin'
import Footer from '../components/Footer'
import { UserAuth } from '../context/UserAuthContext'
import RidersNav from '../components/RidersNav'
import NavbarLogout from '../components/NavbarLogout'
const RidesPosted = () => {
  const {user} = UserAuth();
  return (
    <>
    {user ? <NavbarLogout/> : <NavbarLogin/>}
    <RidersNav/>
    {/* <ActiveRides/> */}
    {/* <Footer/> */}
    </>
  )
}

export default RidesPosted
