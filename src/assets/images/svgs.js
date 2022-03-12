import React from 'react'

export function ChevronLeft() {
  return (
    <svg
      className="chevron-left"
      width="35%"
      height="35%"
      viewBox="0 0 155 309"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M49.306,154.991l101.321,-128.364l-28.987,-22.88l-119.38,151.244c-0,0 119.38,151.245 119.38,151.245l28.987,-22.88l-101.321,-128.365Z" />
    </svg>
  )
}

export function ChevronRight() {
  return (
    <svg
      className="chevron-right"
      width="35%"
      height="35%"
      viewBox="0 0 155 309"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M103.58,154.991l-101.32,-128.364l28.986,-22.88l119.381,151.244c-0,0 -119.381,151.245 -119.381,151.245l-28.986,-22.88l101.32,-128.365Z" />
    </svg>
  )
}

export function CircleFilled() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 143 143"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="71.307"
        cy="71.505"
        r="63.218"
        fill="white"
        stroke="white"
        strokeWidth="8px"
      />
    </svg>
  )
}

export function CircleOutline() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 143 143"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="71.307"
        cy="71.505"
        r="63.218"
        fill="none"
        stroke="grey"
        strokeWidth="5px"
      />
    </svg>
  )
}
