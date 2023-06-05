import React from 'react'
import NavbarLogin from '../components/NavbarLogin'
import Footer from '../components/Footer'
import { UserAuth } from '../context/UserAuthContext'
import UsersRides from '../components/UsersRides'
import NavbarLogout from '../components/NavbarLogout'

const ViewRides = () => {
  const {user} = UserAuth();
  return (
    <>
    {/* {user ? <NavbarLogout/> : <NavbarLogin/>} */}
    <UsersRides/>
    {/* <ActiveRides/> */}
    {/* <Footer/> */}
    </>
  )
}

export default ViewRides
