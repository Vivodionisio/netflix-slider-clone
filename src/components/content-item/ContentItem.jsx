// Transitions (scaling and positioning) work best at screen width of 1449

import React, { useState, useRef, useEffect } from 'react'
import { certBadgeElement } from '../../helpers/certBadgeElement'
import { genreElements } from '../../helpers/genreElements'
import Engagements from '../shared/Engagements'
import { Modal } from './modal/Modal'
import './modal/modal.css'
import { gsap } from 'gsap'
import useItemContent from '../../hooks/useItemContent'

function ContentItem({ content, style, isDisabled, imageConfig }) {
  const [isActive, setIsActive] = useState(false),
    [isOpen, setIsOpen] = useState(false),
    itemContent = useItemContent(content.titleId)

  const inMeRef = useRef() // stores (remembers) if mouse is inside a content item
  const thumbRef = useRef() // ref for original ContentItem initial coordinates
  const containerRef = useRef() // ref for getting mid-expanded coordinates
  let midRef = useRef() // for storing mid-expanded coordinates
  const modalRef = useRef() // ref for modal itself
  const dOfModal = gsap.utils.selector(modalRef) // to select decendent elements

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

  // helper function
  const genreNames = genreElements(genres)

  const certification = release_dates.results
    .find(result => result.iso_3166_1 === 'GB')
    ?.release_dates.filter(
      entry => entry.certification !== '' || ''
    )[0].certification

  // helper function
  const maturityRating = certBadgeElement(certification)

  // useEffects
  useEffect(scrollerTransitionComplete, [isDisabled])

  useEffect(() => {
    if (!modalRef.current || !isOpen) return

    gsap.set('modalRef.current', { xPecent: -50, left: '50%' })

    gsap.set(dOfModal('.inner-wrapper'), {
      position: 'fixed'
    })

    gsap.to(dOfModal('.inner-wrapper'), {
      maxWidth: '37.14%',
      width: '340px',
      top: '30px',
      left: '50%',
      xPercent: -50,
      scaleX: 2.6,
      scaleY: 2.6,
      duration: 0.4
    })

    gsap.to(dOfModal('.gradient'), { opacity: 1, duration: 0.2, delay: 0.1 })
    gsap.to(dOfModal('.closeBtn, engagements'), {
      opacity: 1,
      delay: 0.1,
      duration: 0.4
    })

    gsap.set(dOfModal('.modal-bg'), { backgroundColor: 'rgb(0 0 0 / 63%)' })

    gsap.to(dOfModal('.modal-bg'), {
      autoAlpha: 1
    })
  }, [isOpen])

  // Functions
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
    // This function sets initial dimensions and position for modal based on boundingClientRect of the content item at in its hovered state. Setting is open then triggers useEffect, which deals with the transition to expanded modal.
    midRef = containerRef.current.getBoundingClientRect()

    gsap.set(modalRef.current, { display: 'flex' })

    gsap.set(dOfModal('.modal-bg'), { autoAlpha: 0, display: 'block' })

    gsap.set(dOfModal('.inner-wrapper'), {
      position: 'fixed',
      top: `${midRef.top}px`,
      left: `${midRef.left}px`,
      maxWidth: `${midRef.width}px`,
      width: `${midRef.width}px`,
      transformOrigin: `top`,
      xPercent: 0,
      scaleX: 1,
      scaleY: 1
    })

    gsap.set(dOfModal('.closeBtn, .gradient, .engagements'), { opacity: 0 })
    gsap.set(dOfModal('.card'), { opacity: 1 })

    setIsOpen(true)
  }

  function handleCloseModal() {
    const rect = thumbRef.current.getBoundingClientRect()

    console.log(rect.width)
    const percentage = rect.width / 100

    gsap.defaults({ ease: 'none', duration: 0.4 })
    gsap.to(dOfModal('.modal-bg'), { backgroundColor: 'rgb(0 0 0 / 0%)' })

    gsap.set(dOfModal('.inner-wrapper'), {
      position: 'fixed',
      transformOrigin: 'top'
    })

    // Two elements: 'container' and 'modal'.
    // The container expands on mouse enter by 1.5 adding half its value.
    // handleOpenModal: onClick the modal appears, its initial postion and width defined by the the boundingClient of the expanded container. A change of state then triggers a useEffect which scales the modal by 2.6.
    // handlecloseModal: onclick the modal scales down past 1 to .6666667 (two thirds of 1) sinces its headed for dimensions of the container in its original state before expansion.
    // since that scale value will act upon the new width value, we'll need to make up the difference.
    // TranslateX() (xPercent): translateX  was used to center the modal along with position left. I assumed translate could be set back to 0 but it for some reason 16.7 percent is the magic number! (at least for this approach)
    gsap.to(dOfModal('.inner-wrapper'), {
      width: `${rect.width + percentage * 50.3}`,
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      scaleX: 0.66666667,
      scaleY: 0.66666667,
      xPercent: -16.7,
      duration: 0.4,
      ease: 'none'
    })
    gsap.to(dOfModal('.closeBtn, .gradient, .engagements, .card'), {
      opacity: 0
    })

    const elements = [modalRef.current, dOfModal('.modal-bg')]
    gsap.set(elements, { display: 'none', delay: 0.5 })

    // setIsOpen(false)
    setTimeout(() => {
      setIsOpen(false)
    }, 500)
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
