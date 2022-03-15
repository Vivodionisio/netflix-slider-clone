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
import { getReleaseData } from './request/request'
import {
  CertU,
  CertPG,
  Cert12A,
  Cert12,
  Cert15,
  Cert18,
  CertR18
} from './assets/images/maturity-badges/cert'

const {
  baseUrl,
  path: { part1, part3 },
  API_KEY
} = getReleaseData

const btns = [
  [CircleFilled, IoIosPlay],
  [CircleOutline, IoAddOutline],
  [CircleOutline, BsHandThumbsUp],
  [CircleOutline, BsHandThumbsDown],
  null,
  [CircleOutline, IoIosArrowDown]
]

function ContentItem({ content, style, isDisabled }) {
  const [isActive, setIsActive] = useState(false),
    [isOnTop, setIsOnTop] = useState(false),
    [certBadge, setCertBadge] = useState('')

  const titleId = content.titleId

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

  useEffect(() => {
    let timer
    if (isActive === false) {
      setIsOnTop(true)
      timer = setTimeout(() => {
        setIsOnTop(false)
      }, 300)
    }
    return () => clearTimeout(timer)
  }, [isActive])

  useEffect(() => {
    const url = `${baseUrl + part1 + titleId}/${part3}?${API_KEY}`
    getReleaseInfo()
    async function getReleaseInfo() {
      try {
        const response = await fetch(url)
        if (response.ok === true) {
          const data = await response.json()
          const releaseInfoGB = data.results.filter(
            result => result.iso_3166_1 === 'GB'
          )
          const certification = releaseInfoGB[0].release_dates[0].certification
          const cert = () => {
            if (certification === 'U') return <CertU />
            if (certification === 'PG') return <CertPG />
            if (certification === '12A') return <Cert12A />
            if (certification === '12') return <Cert12 />
            if (certification === '15') return <Cert15 />
            if (certification === '18') return <Cert18 />
            if (certification === 'R18') return <CertR18 />
          }
          setCertBadge(cert)
        } else {
          console.log('No technical errors, but something when wrong.. ?')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  useEffect(() => {
    const url = `${baseUrl}${part1}${titleId}?${API_KEY}`
    getInfo()
    async function getInfo() {
      try {
        const response = await fetch(url)
        if (response.ok === true) {
          const data = await response.json()
          console.log(data)
        } else {
          console.log('No technical errors, but something when wrong.. ?')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  return (
    <div
      className={
        'ContentItem' + (isActive ? ' active' : '') + (isOnTop ? ' on-top' : '')
      }
      style={style}
    >
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
        <img src={content.image} alt="" />
        <div className="card">
          <div className="engagements">{cardButtons}</div>
          <div className="details">
            <p className="rating">New</p>
            {/* <CertU /> */}
            {certBadge}
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
