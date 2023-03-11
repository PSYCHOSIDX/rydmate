import React from 'react'
import '../components/component-styles/footer.css'
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <>
      <div className="footer">

        <div className="footer-left">
        <img src={logo} alt="RydMate" />
        <h5>The Newage way to commute</h5>
        </div>

        <div className="footer-right">
            <h4>
                <b>Group ID : 6</b> <br />
                Don Bosco College Of Enginnering <br />
                Made with 🤍 in India
            </h4>
        </div>
       
      </div>
    </>
  )
}

export default Footer
