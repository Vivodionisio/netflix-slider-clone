import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
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
  const modalRef = useRef() // ref for modal
  const closeBtnRef = useRef()
  const gradientRef = useRef()
  const engagementsRef = useRef()
  const cardRef = useRef()
  const wrapperRef = useRef()
  const modalBgRef = useRef()

  // const refs = useRef({
  //   closeBtnRef,
  //   gradientRef,
  //   engagementsRef,
  //   cardRef,
  //   wrapperRef,
  //   modalBgRef,
  //   modalRef
  // })

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

    gsap.to(modalBgRef.current, {
      backgroundColor: 'rgb(0 0 0 / 63%)',
      transition: 'background-color .4s .1s'
    })

    gsap.to(wrapperRef.current, {
      position: 'fixed',
      maxWidth: '37.14%',
      width: '340px',
      top: '30px',
      left: '50%',
      transform: 'translateX(-50%) scale(2.6, 2.6)',
      transformOrigin: 'top center',
      duration: 0.4,
      delay: 0.1
    })

    gsap.to(gradientRef.current, { opacity: 1, duration: 0.4, delay: 0.1 })

    const elements = [closeBtnRef.current, engagementsRef.current]
    gsap.to(elements, { opacity: 1, duration: 0.5, delay: 0.1 })
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
    const rect = containerRef.current.getBoundingClientRect()

    gsap.to(modalRef.current, { display: 'flex' })

    const modalBg = modalRef.current.querySelector('.modal-bg')
    gsap.to(modalBg, {
      display: 'block',
      backgroundColor: 'rgb(0 0 0 / 0%)',
      transition: 'background-color .5s'
    })

    const ele = modalRef.current.querySelector('.inner-wrapper')
    gsap.set(ele, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      maxWidth: `${rect.width}px`,
      transformOrigin: 'top center'
    })

    const closeBtn = modalRef.current.querySelector('.closeBtn')
    const gradEle = modalRef.current.querySelector('.gradient')
    const engagementsEle = modalRef.current.querySelector('.engagements')

    const elements = [closeBtn, gradEle, engagementsEle]

    gsap.set(elements, { opacity: 0 })

    const card = modalRef.current.querySelector('.card')
    card.style.opacity = 1

    setIsOpen(true)
  }

  function handleCloseModal() {
    const rect = thumbRef.current.getBoundingClientRect()

    gsap.to(modalBgRef.current, {
      backgroundColor: 'rgb(0 0 0 / 0%)',
      duration: 0.5
    })

    setTimeout(() => {
      modalRef.current.style.display = 'none'
      modalBgRef.current.style.display = 'none'
    }, 400)

    gsap.to(wrapperRef.current, {
      position: 'absolute',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      maxWidth: `${rect.width}px`,
      scaleY: 1,
      scaleX: 1
    })

    const elements = [
      closeBtnRef.current,
      gradientRef.current,
      engagementsRef.current,
      cardRef.current
    ]
    gsap.to(elements, { opacity: 0, duration: 0.3 })

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
        <div ref={cardRef} className="card">
          <Engagements
            ref={engagementsRef}
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
