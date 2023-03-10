import React from 'react'
import CardBox from '../components/CardBox'
import NavbarLogin from '../components/NavbarLogin'
import Search from '../components/Search'
import OfferAd from '../components/OfferAd'
import '../global-styles/global.css'
import AlertAd from '../components/AlertAd'


const Home = () => {
  return (
    <>
    <NavbarLogin/>
    <Search/>
    <CardBox/>
    <OfferAd/>
    <AlertAd/>
    </>
  )
}

export default Home
