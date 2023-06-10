import React from 'react'
import '../components/component-styles/success.css';
import { Link } from 'react-router-dom';


const PaymentSuccess = () => {

  return (
    <>


    <section className="page_404">
	<div className="container">
		<div className="row">	
		<div className="col-sm-12 ">
		<div className="col-sm-10 col-sm-offset-1  text-center">
		<div className="four_zero_bg">
			<h2 className="text-center ">Successful !</h2>
		</div>
		
		<div className="contant_box_404">
		<h3 className="h2">
		Your Payment Was Successful !
		</h3>
		<p>The page you are looking for is not available !</p>
		<Link to='/' className='link'> 
		<p  className='link_404' >Go to Rides</p>
		</Link>
	</div>
		</div>
		</div>
		</div>
	</div>


</section>

    </>
  )
}

export default PaymentSuccess;
