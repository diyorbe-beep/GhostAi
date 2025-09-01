import React from 'react'
import './main.css'
import { assets } from '../../assets/assets'
const main = () => {
  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.us} alt="" />
      </div>
    </div>
  )
}

export default main
