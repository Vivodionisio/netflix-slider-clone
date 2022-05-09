import React, { useState, useRef, useEffect } from 'react'
import { certBadgeElement } from '../../helpers/certBadgeElement'
import { genreElements } from '../../helpers/genreElements'
import Engagements from '../shared/Engagements'
import { Modal } from './modal/Modal'
import './modal/modal.css'

import useItemContent from '../../hooks/useItemContent'

function ContentItem({ content, style, isDisabled, imageConfig }) {
  const [isActive, setIsActive] = useState(false),
    [isOpen, setIsOpen] = useState(false),
    itemContent = useItemContent(content.titleId)

  const inMeRef = useRef() // stores (remembers) if mouse is inside a content item
  const thumbRef = useRef() // ref for original ContentItem initial coordinates
  const containerRef = useRef() // ref for getting expanded coordinates
  const modalRef = useRef() // ref for modal itself

  // Presentation data
  const { backdrop_path, release_dates, genres, runtime } = itemContent
  const { baseImageUrl, imageSizes } = imageConfig
  const image = baseImageUrl + imageSizes[1] + backdrop_path
  const imageLg = baseImageUrl + imageSizes[2] + backdrop_path

  const hr = Math.floor(runtime / 60)
  const m = runtime % 60
  const duration = (
    <span className="duration">
      {hr && `${hr}hr `}
      {m && `${m}m `}
    </span>
  )

  const genreNames = genreElements(genres) // helper function

  const certification = release_dates.results
    .find(result => result.iso_3166_1 === 'GB')
    ?.release_dates.filter(
      entry => entry.certification !== '' || ''
    )[0].certification

  const maturityRating = certBadgeElement(certification) // helper function

  useEffect(scrollerTransitionComplete, [isDisabled])

  useEffect(() => {
    if (!modalRef.current || !isOpen) return

    const modalBg = modalRef.current.querySelector('.modal-bg')
    modalBg.style.backgroundColor = 'rgb(0 0 0 / 63%)'
    modalBg.style.transition = 'background-color .4s .1s'

    const ele = modalRef.current.querySelector('.inner-wrapper')
    ele.style.position = 'fixed'
    ele.style.maxWidth = '37.14%'
    ele.style.width = '340px'
    ele.style.top = '30px'
    ele.style.left = '50%'
    ele.style.transform = 'translateX(-50%) scale(2.6, 2.6)'
    ele.style.transformOrigin = 'top center'
    ele.style.transition = 'All .4s .1s'

    const gradEle = modalRef.current.querySelector('.gradient')
    gradEle.style.opacity = 1
    gradEle.style.transition = 'opacity .4s .1s'

    const closeBtn = modalRef.current.querySelector('.closeBtn')
    closeBtn.style.opacity = 1
    closeBtn.style.transition = 'opacity .5s .1s'

    const engagementsEle = modalRef.current.querySelector('.engagements')
    engagementsEle.style.opacity = 1
    engagementsEle.style.transition = 'opacity .5s .1s'
  }, [isOpen])

  let timer
  function handleMouseEnter() {
    // Slight delay here to mitigate effect of accidental mouseenters
    timer = setTimeout(() => {
      setIsActive(true)
    }, 500)
  }

  function handleMouseLeave() {
    inMeRef.current = false
    setIsActive(false)
    clearTimeout(timer)
  }

  // scrollerTransitionComplete, called from useEffect when isDisabled changes.
  // Context: after slider transition completes, isDisabled changes to back to true and useEfect is called which in turn calls scrollerTransitionComplete - in this function if a contentItem has inMeRef.current with a value of true, the isActive state for item is set to true. (mouse came in and didn't leave - see handle leave above)

  function scrollerTransitionComplete() {
    if (!isDisabled && inMeRef.current) {
      const timer = setTimeout(() => {
        setIsActive(true)
      }, 500)
      return () => {
        clearTimeout(timer)
      }
    }
  }

  function handleOpenModal() {
    const rectRef = containerRef.current.getBoundingClientRect()

    modalRef.current.style.display = 'flex'

    const modalBg = modalRef.current.querySelector('.modal-bg')
    modalBg.style.display = 'block'
    modalBg.style.backgroundColor = 'rgb(0 0 0 / 0%)'
    modalBg.style.transition = 'background-color .5s'

    const ele = modalRef.current.querySelector('.inner-wrapper')
    ele.style.position = 'fixed'
    ele.style.left = `${rectRef.left}px`
    ele.style.top = `${rectRef.top}px`
    ele.style.maxWidth = `${rectRef.width}px`
    ele.style.transformOrigin = 'top center'

    const closeBtn = modalRef.current.querySelector('.closeBtn')
    closeBtn.style.opacity = 0

    const gradEle = modalRef.current.querySelector('.gradient')
    gradEle.style.opacity = 0

    const engagementsEle = modalRef.current.querySelector('.engagements')
    engagementsEle.style.opacity = 0

    const card = modalRef.current.querySelector('.card')
    card.style.opacity = 1

    setIsOpen(true)
  }

  function handleCloseModal() {
    const rect = thumbRef.current.getBoundingClientRect()

    const modalBg = modalRef.current.querySelector('.modal-bg')
    modalBg.style.backgroundColor = 'rgb(0 0 0 / 0%)'
    modalBg.style.transition = 'background-color .5s'

    setTimeout(() => {
      modalRef.current.style.display = 'none'
      modalBg.style.display = 'none'
    }, 400)

    const ele = modalRef.current.querySelector('.inner-wrapper')
    ele.style.position = 'absolute'
    ele.style.top = `${rect.top}px`
    ele.style.left = `${rect.left}px`
    ele.style.maxWidth = `${rect.width}px`
    ele.style.transform = 'scale(1, 1)'
    ele.style.transition = 'top .3s, left .3s, transform .3s,'

    const closeBtn = modalRef.current.querySelector('.closeBtn')
    closeBtn.style.opacity = 0
    closeBtn.style.transition = 'opacity .3s'

    const gradEle = modalRef.current.querySelector('.gradient')
    gradEle.style.opacity = 0
    gradEle.style.transition = 'opacity .3s'

    const engagementsEle = modalRef.current.querySelector('.engagements')
    engagementsEle.style.opacity = 0
    engagementsEle.style.transition = 'opacity .3s'

    const card = modalRef.current.querySelector('.card')
    card.style.opacity = 0
    card.style.transition = 'opacity .3s'

    setTimeout(() => setIsOpen(false), 400)
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
        <div className="header">
          <img src={imageLg} alt="title" />
        </div>
        <div className="card">
          <Engagements
            open={isOpen}
            openModal={handleOpenModal}
            changeActiveState={setIsActive}
          />
          <div className="details">
            <p className="rating">New</p>
            {maturityRating}
            {duration}
            <span className="gap">&nbsp;</span>
          </div>
          <div className="tags">
            <p className="genres">{genreNames}</p>
          </div>
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
