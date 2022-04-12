import React from 'react'
import ReactDom from 'react-dom'
import './App.css'
import { IoCloseOutline } from 'react-icons/io5'

// const OVERLAY_STYLES = {
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: 'rgba(0, 0, 0, 0.7)',
//   zIndex: 1000
// }

export default function Modal({ open, children, onClose, imgUrl }) {
  if (!open) return null
  return (
    <div className="Modal">
      {/* <div style={OVERLAY_STYLES} /> */}
      <div className={`box ${open ? ' open' : ''}`}>
        <IoCloseOutline onClick={onClose} className="close" />
        {children}
        <img src={imgUrl} alt="feature" />
      </div>
    </div>
  )
}
