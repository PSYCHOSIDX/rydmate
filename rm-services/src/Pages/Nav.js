import React from 'react'
import NavbarLogin from '../components/NavbarLogin'
import Footer from '../components/Footer'
import { UserAuth } from '../context/UserAuthContext'
import NavigationPage from '../components/NavigationPage'
import NavbarLogout from '../components/NavbarLogout'
const Nav = () => {
  const {user} = UserAuth();
  return (
    <>
    {user ? <NavbarLogout/> : <NavbarLogin/>}
    <NavigationPage/>
    <Footer/>
    </>
  )
}

export default Nav
