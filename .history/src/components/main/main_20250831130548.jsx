import React from 'react'
import './main.css'
import { assets } from '../../assets/assets'
const main = () => {
  return (
    <div className='main'>
      <div className="nav">
        <p>GhostAi</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main_container">
        <div className="greet">
          <p><span>Hello, Dev.</span></p>
          <p>How can I help you today?</p>
        </div>
        <div className="cards">
            <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src="" alt="" />
            </div>
        </div>
      </div>
    </div>
  )
}

export default main
