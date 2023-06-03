import React from 'react'
import CardBox from '../components/CardBox'
import NavbarLogin from '../components/NavbarLogin'
import Search from '../components/Search'
import OfferAd from '../components/OfferAd'
import AlertAd from '../components/AlertAd'
import Footer from '../components/Footer'
import '../global-styles/global.css'
import { UserAuth } from '../context/UserAuthContext'
import NavbarLogout from '../components/NavbarLogout'

const Home = () => {

  const {user} = UserAuth();

  return (
    <>
    {user ? <NavbarLogout/> : <NavbarLogin/>}
    {}
    <Search/>
    <CardBox/>
    <OfferAd/>
    <AlertAd/>
    <Footer/>
    </>
  )
}

export default Home
