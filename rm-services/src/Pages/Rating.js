import React from 'react'

import NavbarLogin from '../components/NavbarLogin'
import { UserAuth } from '../context/UserAuthContext'
import Footer from '../components/Footer'
import '../global-styles/global.css'
import '../components/Rating'


const Rating = () => {
    const {user} = UserAuth();
    return (
        <div>
            <NavbarLogin />
            <Rating/>
            <Footer />
        </div>
    )
}
export default Rating;