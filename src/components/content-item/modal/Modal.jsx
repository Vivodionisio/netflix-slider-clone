import React from 'react'
import Engagements from '../../shared/Engagements'
import { IoCloseOutline } from 'react-icons/io5'
import './modal.css'

export const Modal = React.forwardRef(
  (
    { open, image, maturityRating, genreNames, itemContent, handleCloseModal },
    ref
  ) => {
    const { overview, runtime } = itemContent

    // const genres = genreNames.split('•')

    console.log(genreNames)

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
            <div className="left">
              <div className="details">
                <span className="rating">New</span>
                <span>1992</span>
                {maturityRating}
                <span className="duration">1hr 15m</span>
              </div>
              <p className="description">{overview}</p>
            </div>
            <div className="tags">
              <p className="genres">
                <span className="title">Genres:</span> {genreNames}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
