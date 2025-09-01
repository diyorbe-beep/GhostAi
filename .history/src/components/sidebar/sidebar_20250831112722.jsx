import React from 'react'
import './sidebar.css'
import {assets} from '../../assets/assets'
export default function sidebar() {
  return (
    <div className='sidebar'>
      <div className="top">
        <img className='menu' src={assets.menu_icon} alt="" />
        /new_chat
      </div>
      <div className="bottom"></div>
    </div>
  )
}
