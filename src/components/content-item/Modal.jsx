import React from 'react'
import Engagements from './Engagements'
import { IoCloseOutline } from 'react-icons/io5'
import './modal.css'

export const Modal = React.forwardRef(
  ({ open, image, maturityRating, genreNames, handleCloseModal }, ref) => {
    return (
      <div ref={ref} className={!open ? 'hide' : 'modal'}>
        <div className="modal-bg"></div>
        <div className="inner-wrapper">
          <div className="header">
            <img src={image} alt="title" />
            <IoCloseOutline
              className="closeBtn"
              onClick={() => {
                handleCloseModal()
              }}
            />
            <div className="gradient"></div>
            <Engagements open={open} />
          </div>
          <div className="card">
            <div className="details">
              <span className="rating">New</span>
              <span>1992</span>
              {maturityRating}
              <span className="duration">1hr 15m</span>
            </div>
            <div className="tags">
              <p className="genres">{genreNames}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
