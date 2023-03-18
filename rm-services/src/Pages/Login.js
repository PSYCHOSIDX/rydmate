import React from 'react'
import '../global-styles/global.css'
import SignIn from '../components/auth/SignIn'
// import SignUp from '../components/auth/SignUp'
// import SignInWithGoogle from '../components/auth/SignInWithGoogle'
import Footer from '../components/Footer'

// import AuthDetails from '../components/auth/AuthDetails'

const Login = () => {
  return (
    <>
    <SignIn/>
    {/* <SignInWithGoogle/> */}
    {/* <SignUp/> */}
    {/* <AuthDetails/> */}
    <Footer/>
    </>
  )
}

export default Login