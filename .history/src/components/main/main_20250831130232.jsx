import React from 'react'
import './main.css'
import { assets } from '../../assets/assets'
const main = () => {
  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
      </div>
      <div className="main_container">
        <div className="greet">
          <p><span/p>
        </div>
      </div>
    </div>
  )
}

export default main
