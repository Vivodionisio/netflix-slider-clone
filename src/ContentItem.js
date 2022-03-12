import React, { useState, useEffect } from 'react'
import { IoIosPlay } from 'react-icons/io'
import { IoAddOutline } from 'react-icons/io5'
import { BsHandThumbsUp } from 'react-icons/bs'
import { BsHandThumbsDown } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'
import { CircleOutline, CircleFilled } from './assets/images/svgs'

const btns = [
  [CircleFilled, IoIosPlay],
  [CircleOutline, IoAddOutline],
  [CircleOutline, BsHandThumbsUp],
  [CircleOutline, BsHandThumbsDown],
  null,
  [CircleOutline, IoIosArrowDown]
]

function ContentItem({ content, style }) {
  const [isActive, setIsActive] = useState(false),
    [isOnTop, setIsOnTop] = useState(false)

  const cardButtons = btns.map((btn, i) => {
    if (btn !== null) {
      const [Circle, Icon] = btn
      return (
        <button key={i}>
          <Circle className="circle" />
          <Icon className="icon" />
        </button>
      )
    } else {
      return <span key={i}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
    }
  })

  //
  useEffect(() => {
    let timer
    if (isActive === false) {
      setIsOnTop(true)
      timer = setTimeout(() => {
        setIsOnTop(false)
      }, 400)
    }
    return () => clearTimeout(timer)
  }, [isActive])

  return (
    <div
      className={
        'ContentItem' + (isActive ? ' active' : '') + (isOnTop ? ' on-top' : '')
      }
      style={style}
      onMouseEnter={() => {
        setIsActive(true)
      }}
      onMouseLeave={() => {
        setIsActive(false)
      }}
    >
      <img src={content.image} alt="" />
      <div className="card">
        <div className="engagements">{cardButtons}</div>
      </div>
    </div>
  )
}

export default ContentItem
