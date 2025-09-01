import React from 'react'
import './sidebar.css'
import {assets} from '../../assets/assets'
export default function sidebar() {
  return (
    <div className='sidebar'>
      <div className="top">
        <img className='menu' src={assets.menu_icon} alt="" />
        <div className="new_chat">
            <img src={assets.new_chat_icon} alt="" />
        </div>
      </div>
      <div className="bottom"></div>
    </div>
  )
}
