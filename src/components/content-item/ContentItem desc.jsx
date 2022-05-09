import React, { useState, useRef, useEffect } from 'react'
import Engagements from '../shared/Engagements'
import { Modal } from './modal/Modal'
import './modal/modal.css'

import useItemContent from '../../hooks/useItemContent'

function ContentItem({ content, style, isDisabled, imageConfig }) {
  const itemId = content.titleId

  const [isActive, setIsActive] = useState(false),
    [isOpen, setIsOpen] = useState(false),
    itemContent = useItemContent(itemId)

  const inMeRef = useRef() // stores (remembers) if mouse inside a contentitem
  const thumbRef = useRef() // ref for original ContentItem initial coordinates
  const containerRef = useRef() // ref for getting expanded coordinates
  const modalRef = useRef() // ref for modal itself
  const rectRef = useRef() // is this necessary? Could be a const?

  useEffect(() => {
    if (!isDisabled && inMeRef.current) {
      const timer = setTimeout(() => {
        if (!inMeRef.current) return
        setIsActive(true)
      }, 500)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [isDisabled])

  useEffect(() => {
    if (!modalRef.current || !rectRef.current || !isOpen) return
    // TRANSITION TO FINAL POSITION FOR MODAL ELEMENT
    // set styles on dom elements for modal, etc
  }, [isOpen])

  function handleOpenModal() {
    // INITIAL POSITION FOR MODAL ELEMENT
    // get the coordinates for the expanded ContentItem,to set the initial position for the modal and show it - the final style and position for the modal is set in the useEffect hook upon rerender caused by the following setIsOpen...
    setIsOpen(true)
  }

  function handleCloseModal() {
    // CLOSE MODAL
    // Transition modal to its initial position and hide.
    setTimeout(() => setIsOpen(false), 400)
  }

  let timer
  function handleMouseEnter() {
    timer = setTimeout(() => {
      setIsActive(true)
    }, 500)
  }

  function handleMouseLeave() {
    inMeRef.current = false
    setIsActive(false)
    clearTimeout(timer)
  }

  return (
    <div
      className={
        'ContentItem' + (isActive ? ' active' : '') + (isOpen ? ' open' : '')
      }
      style={style}
    >
      <div className="thumb" ref={thumbRef}>
        <img src={image} alt="title" />
      </div>

      <div
        ref={containerRef}
        className={!isOpen ? 'container' : 'hide'}
        onMouseEnter={
          isDisabled
            ? () => {
                inMeRef.current = true
                setIsActive(false)
              }
            : () => {
                handleMouseEnter()
              }
        }
        onMouseLeave={handleMouseLeave}
      >
        <div className="card">
          <Engagements
            open={isOpen}
            openModal={handleOpenModal}
            changeActiveState={setIsActive}
          />
        </div>
      </div>

      <Modal
        ref={modalRef}
        open={isOpen}
        handleCloseModal={handleCloseModal}
        image={imageLg}
        maturityRating={maturityRating}
        genreNames={genreNames}
        itemContent={itemContent}
        duration={duration}
      />
    </div>
  )
}

export default ContentItem

// State:
//        • isDisabled (prop passed from ContentScroller)
//           - disable onMouseenter for duration of slide transition
//        • isActive
//           - toggles 'active' class (styles for first expand)
