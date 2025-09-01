import React from 'react'
import './sidebar.css'
import imgs from '../../assets/assets'
export default function sidebar() {
  return (
    <div className='sidebar'>
      <div className="top">
        <img src={imgs.menu_} alt="" />
      </div>
      <div className="bottom"></div>
    </div>
  )
}
