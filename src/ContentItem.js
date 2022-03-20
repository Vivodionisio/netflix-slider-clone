import React, { useState, useEffect } from 'react'
import { IoIosPlay } from 'react-icons/io'
import { IoAddOutline } from 'react-icons/io5'
import { BsHandThumbsUp } from 'react-icons/bs'
import { BsHandThumbsDown } from 'react-icons/bs'
import { IoIosArrowDown } from 'react-icons/io'
import {
  CircleOutline,
  CircleFilled
} from './assets/images/card-btns/card-btns'
import useItemContent from './useItemContent'
import {
  CertU,
  CertPG,
  Cert12A,
  Cert12,
  Cert15,
  Cert18,
  CertR18
} from './assets/images/maturity-badges/cert'

const btns = [
  [CircleFilled, IoIosPlay],
  [CircleOutline, IoAddOutline],
  [CircleOutline, BsHandThumbsUp],
  [CircleOutline, BsHandThumbsDown],
  null,
  [CircleOutline, IoIosArrowDown]
]

function ContentItem({ content, style, isDisabled }) {
  const titleId = content.titleId

  const [isActive, setIsActive] = useState(false),
    [certBadge, setCertBadge] = useState(''),
    titleContent = useItemContent(titleId)

  const {
    baseImageUrl,
    backdrop_path,
    certification,
    genres,
    imageSizes,
    original_title,
    overview,
    runtime
  } = titleContent

  console.log(titleContent)
  const image = baseImageUrl + imageSizes[3] + backdrop_path

  // const imageUrl = `${baseImageUrl}`

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
      return (
        <span className="gap" key={i}>
          &nbsp;
        </span>
      )
    }
  })

  // const certification = null
  // const cert = () => {
  //   if (certification === 'U') return <CertU />
  //   if (certification === 'PG') return <CertPG />
  //   if (certification === '12A') return <Cert12A />
  //   if (certification === '12') return <Cert12 />
  //   if (certification === '15') return <Cert15 />
  //   if (certification === '18') return <Cert18 />
  //   if (certification === 'R18') return <CertR18 />
  // }
  // setCertBadge(cert)

  return (
    <div className={'ContentItem' + (isActive ? ' active' : '')} style={style}>
      <div
        className="container"
        onMouseMove={
          isDisabled
            ? () => {
                setIsActive(false)
              }
            : () => {
                setIsActive(true)
              }
        }
        onMouseLeave={() => {
          setIsActive(false)
        }}
      >
        <img src={image} alt="title" />
        <div className="card">
          <div className="engagements">{cardButtons}</div>
          <div className="details">
            <p className="rating">New</p>
            {/* {certBadge} */}
            <p className="duration">1hr 15m</p>
            <span className="gap">&nbsp;</span>
          </div>
          <div className="tags">
            <p>Gritty &#8226; Irreverent &#8226; Animation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContentItem
