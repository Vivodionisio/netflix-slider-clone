/* 
Interactions with a ContentItem:
The ContentItem has three child elements, with classnames 'thumb', 'container' and 'modal' respectively. 
* thumb - this displays the title image, and can't be interacted with. 
* Container - this displays the title image and is initially the same size as the thumb. However it expands on mouseenter to reveal a card at the bottom of the image, with information about the presentation and a button with a down arrow for revealing the modal. 
* Modal - when the openModel is called, the modal appears above the container with the same width and top position, but with height added to the bottom to accomodate the card. openModal sets state triggering a useEffect in which the code expand the modal to its full size. The close button, shrinks the modal to the size of the thumb.

In short, the ContentItem has three sizes: 
1. container initial (same as thumb)
2. container expanded and modal initial
3. modal expanded
*/

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

  const inMeRef = useRef() // 'true' if mouse is inside a ContentItem
  const thumbRef = useRef() // ref for original ContentItem initial coordinates
  const containerRef = useRef() // ref for getting mid-expanded coordinates
  let midRef = useRef() // for storing mid-expanded coordinates
  const modalRef = useRef() // ref for modal itself
  const dOfModal = gsap.utils.selector(modalRef) // to select decendent elements of modal

  // Presentation data - pulled in from useItemContent hook
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

  // Api Data
  const genreNames = genreElements(genres)

  const certification = release_dates.results
    .find(result => result.iso_3166_1 === 'GB')
    ?.release_dates.filter(
      entry => entry.certification !== '' || ''
    )[0].certification

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

  /* 
  scrollerTransitionComplete is called from useEffect when isDisabled state changes. If when scroller transition completes the mouse is on a contentItem, we want that item to expand.

  Desc: after slider transition completes, isDisabled changes back to true and useEfect is called which in turn calls scrollerTransitionComplete - in this function if a contentItem has inMeRef.current with a value of true, the isActive state for item is set to true. (mouse came in and didn't leave - see handle leave above)
*/
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
    // This function sets initial dimensions and position for modal based on boundingClientRect of the content item at in its hovered state. Setting isOpen then triggers useEffect, which deals with the transition to expanded modal.
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
    const percentage = rect.width / 100

    gsap.defaults({ ease: 'none', duration: 0.4 })
    gsap.to(dOfModal('.modal-bg'), { backgroundColor: 'rgb(0 0 0 / 0%)' })

    gsap.set(dOfModal('.inner-wrapper'), {
      position: 'fixed',
      transformOrigin: 'top'
    })

    // The modal isn't merely returning to it previous size (that of the expanded thumnail), it needs to decreece further to the original size of the thumnail. So the modal scales down past 1 to 0.66666667.
    // since that scale value will act upon the new width value, we'll need to make up the difference.
    // TranslateX() (xPercent as its written in GSAP)  was used to center the modal along with position left. I assumed translate would be set back to 0 but for some reason 16.7 percent is the magic number here.

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
