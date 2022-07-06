import React from 'react'
import { CircleFilled, CircleOutline } from '../../svg/circles.js'
import { IoIosPlay } from 'react-icons/io'
import { IoAddOutline } from 'react-icons/io5'
import { BsHandThumbsUp } from 'react-icons/bs'
import { BsHandThumbsDown } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'

export default function Engagements({ open, openModal, changeActiveState }) {
  return open ? (
    <div className="engagements">
      <button>
        <IoIosPlay className="icon" />
        <span>Play</span>
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
  ) : (
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
          openModal()
          changeActiveState(false)
        }}
      >
        <CircleOutline className="circle" />
        <IoIosArrowDown className="icon" />
      </button>
    </div>
  )
}

// adjust rather than delete and update
