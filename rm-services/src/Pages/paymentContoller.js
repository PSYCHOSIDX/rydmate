import React from 'react'
import NavbarLogin from '../components/NavbarLogin'
import Footer from '../components/Footer'
import { useState } from 'react';
import StripeContainer from './components/StripeContainer';


const Home = () => {const [
    showItem, setShowItem] = useState(false);
  return (
    <>  
    <NavbarLogin/>
    <div className='App'>
			<h1>The ride</h1>
			{showItem ? (<StripeContainer />) : (
				<>
					<h3>₹100.00</h3>
					<img src={'https://imgd.aeplcdn.com/370x208/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=75'} alt='car' />
					<button onClick={() => setShowItem(true)}>book car</button>
				</>
			)}
		</div>
    <Footer/>
    </>
  )
}

export default App