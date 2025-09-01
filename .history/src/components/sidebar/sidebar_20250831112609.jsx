import React from 'react'
import './sidebar.css'
import {assets} from '../../assets/assets'
export default function sidebar() {
  return (
    <div className='sidebar'>
      <div className="top">
        <img src={imgs.menu_icon} alt="" />
      </div>
      <div className="bottom"></div>
    </div>
  )
}
