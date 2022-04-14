import React, { useState, useRef, useEffect } from 'react'
import { certBadgeElement } from './helpers/certBadgeElement'
import { genreElements } from './helpers/genreElements'
import {
  CircleFilled,
  CircleOutline
} from './assets/images/card-btns/circles.js'
import { IoIosPlay } from 'react-icons/io'
import { IoAddOutline } from 'react-icons/io5'
import { BsHandThumbsUp } from 'react-icons/bs'
import { BsHandThumbsDown } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCloseOutline } from 'react-icons/io5'
import './Modal.css'

import useItemContent from './useItemContent'

function ContentItem({ content, style, isDisabled, imageConfig }) {
  const itemId = content.titleId

  const [isActive, setIsActive] = useState(false),
    [isModal, setIsModal] = useState(false),
    [isOpen, setIsOpen] = useState(false),
    itemContent = useItemContent(itemId)

  const inMeRef = useRef() // 'remember' whether mouse is within a content item
  const thumbRef = useRef()
  const containerRef = useRef()
  const modalRef = useRef()
  const rectRef = useRef()

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
    const ele = modalRef.current.querySelector('.inner-wrapper')
    ele.style.position = 'fixed'
    ele.style.top = '150px'
    ele.style.left = '50%'
    ele.style.transform = 'scale(2, 2) translateX(-50%)'
    ele.style.transformOrigin = 'left'
    // ele.style.transition = 'All .4s .2s'
    ele.style.transition =
      'top .4s .2s, left .4s .2s, transform .4s .2s, transform-origin .4s .2s'

    const closeBtn = modalRef.current.querySelector('.closeBtn')
    closeBtn.style.opacity = 1
    closeBtn.style.transition = 'opacity .5s .2s'

    const engagementsEle = modalRef.current.querySelector('.engagements')
    engagementsEle.style.opacity = 1
    engagementsEle.style.transition = 'opacity .5s .2s'
  }, [isOpen])

  const {
    backdrop_path,
    release_dates,
    genres,
    original_title,
    overview,
    runtime
  } = itemContent

  const { baseImageUrl, imageSizes } = imageConfig
  const image = baseImageUrl + imageSizes[1] + backdrop_path
  const imageLg = baseImageUrl + imageSizes[2] + backdrop_path

  const genreNames = genreElements(genres) // helper function

  // getting certification from release_dates
  const certification = release_dates.results
    .find(result => result.iso_3166_1 === 'GB')
    ?.release_dates.filter(
      entry => entry.certification !== '' || ''
    )[0].certification

  const maturityRating = certBadgeElement(certification) // helper function

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

  function handleOpenModal() {
    rectRef.current = containerRef.current.getBoundingClientRect()

    modalRef.current.style.display = 'flex'
    modalRef.current.style.backgroundColor = 'rgb(0 0 0 / 63%)'
    modalRef.current.style.transition = 'background-color .5s'

    const ele = modalRef.current.querySelector('.inner-wrapper')
    ele.style.position = 'fixed'
    ele.style.left = `${rectRef.current.left}px`
    ele.style.top = `${rectRef.current.top}px`
    ele.style.maxWidth = `${rectRef.current.width}px`
    ele.style.transformOrigin = 'unset'

    const closeBtn = modalRef.current.querySelector('.closeBtn')
    closeBtn.style.opacity = 0

    const engagementsEle = modalRef.current.querySelector('.engagements')
    engagementsEle.style.opacity = 0

    const card = modalRef.current.querySelector('.card')
    card.style.opacity = 1

    setIsOpen(true)
  }

  function handleCloseModal() {
    const rect = thumbRef.current.getBoundingClientRect()
    modalRef.current.style.backgroundColor = 'rgb(0 0 0 / 0%)'
    modalRef.current.style.transition = 'background-color .4s'
    setTimeout(() => {
      modalRef.current.style.display = 'none'
    }, 400)

    const ele = modalRef.current.querySelector('.inner-wrapper')
    ele.style.position = 'absolute'
    ele.style.top = `${rect.top}px`
    ele.style.left = `${rect.left}px`
    ele.style.maxWidth = `${rect.width}px`
    ele.style.transform = 'scale(1, 1)'
    ele.style.transformOrigin = 'revert'
    ele.style.transition =
      'top .4s, max-width .4s, transform .4s, transform-origin .4s, left .4s'

    const closeBtn = modalRef.current.querySelector('.closeBtn')
    closeBtn.style.opacity = 0
    closeBtn.style.transition = 'opacity .15s'

    const engagementsEle = modalRef.current.querySelector('.engagements')
    engagementsEle.style.opacity = 0
    engagementsEle.style.transition = 'opacity .15s'

    const card = modalRef.current.querySelector('.card')
    card.style.opacity = 0
    card.style.transition = 'opacity .15s'

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
          <div className="engagements">
            <button>
              <CircleFilled className="circle" />
              <IoIosPlay className="icon" />
            </button>
            <button>
              <CircleOutline className="circle" />
              <IoAddOutline className="icon" />
            </button>
            <button>
              <CircleOutline className="circle" />
              <BsHandThumbsUp className="icon" />
            </button>
            <button>
              <CircleOutline className="circle" />
              <BsHandThumbsDown className="icon" />
            </button>
            <span className="gap">&nbsp;</span>
            <button
              onClick={() => {
                handleOpenModal()
                setIsActive(false)
              }}
            >
              <CircleOutline className="circle" />
              <IoIosArrowDown className="icon" />
            </button>
          </div>
          <div className="details">
            <p className="rating">New</p>
            {maturityRating}
            <p className="duration">1hr 15m</p>
            <span className="gap">&nbsp;</span>
          </div>
          <div className="tags">
            <p className="genres">{genreNames}</p>
          </div>
        </div>
      </div>

      <div ref={modalRef} className={!isOpen ? 'hide' : 'modal'}>
        <div className="inner-wrapper">
          <div className="header">
            <img src={imageLg} alt="title" />
            <IoCloseOutline
              className="closeBtn"
              onClick={() => {
                handleCloseModal()
              }}
            />
            <div className="engagements">
              <button>
                <CircleFilled className="circle" />
                <IoIosPlay className="icon" />
              </button>
              <button>
                <CircleOutline className="circle" />
                <IoAddOutline className="icon" />
              </button>
              <button>
                <CircleOutline className="circle" />
                <BsHandThumbsUp className="icon" />
              </button>
              <button>
                <CircleOutline className="circle" />
                <BsHandThumbsDown className="icon" />
              </button>
            </div>
          </div>
          <div className="card">
            <div className="details">
              <p className="rating">New</p>
              {maturityRating}
              <p className="duration">1hr 15m</p>
            </div>
            <div className="tags">
              <p className="genres">{genreNames}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentItem
