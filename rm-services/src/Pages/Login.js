import React from 'react'
import '../global-styles/global.css'
import SignIn from '../components/auth/SignIn'
// import SignUp from '../components/auth/SignUp'
// import SignInWithGoogle from '../components/auth/SignInWithGoogle'
import Footer from '../components/Footer'


const Login = () => {
  return (
    <>
    <SignIn/>
    {/* <SignInWithGoogle/> */}
    {/* <SignUp/> */}
    <Footer/>
    </>
  )
}

export default Login