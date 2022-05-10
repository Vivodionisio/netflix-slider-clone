import { gsap } from 'gsap'

export function initialParameters(modalRef, dOfModal, containerRef) {
  const rectRef = containerRef.current.getBoundingClientRect()
  const tl = gsap.timeline({ defaults: { duration: 0.4 } })

  tl.set(modalRef.current, { display: 'flex' })
  tl.set(dOfModal('.modal-bg'), { display: 'block' })
  tl.to(dOfModal('.modal-bg'), { backgroundColor: 'rgb(0 0 0 / 0%)' })
  tl.set(
    dOfModal('.inner-wrapper'),
    {
      position: 'fixed',
      top: `${rectRef.top}px`,
      left: `${rectRef.left}px`,
      maxWidth: `${rectRef.width}px`,
      transformOrigin: 'top center'
    },
    0
  )

  tl.set(dOfModal('.closeBtn, .gradient, .engagements'), { opacity: 0 })
  tl.set(dOfModal('.card'), { opacity: 1 })

  return tl
}

export function openModal(dOfModal) {
  const tl = gsap.timeline()

  tl.to(
    dOfModal('.modal-gb'),
    {
      backgroundColor: 'rgb(0 0 0 / 63%)',
      duration: 0.4,
      delay: 0.1
    },
    0
  )

  tl.set(
    dOfModal('.inner-wrapper'),
    {
      position: 'fixed',
      transformOrigin: 'top center'
    },
    0
  )

  tl.to(
    dOfModal('.inner-wrapper'),
    {
      maxWidth: '37.14%',
      width: '340px',
      top: '30px',
      left: '50%',
      xPercent: -50,
      scaleX: 2.6,
      scaleY: 2.6
    },
    0
  )

  tl.to(dOfModal('.gradient'), { opacity: 1, duration: 0.4, delay: 0.1 })
  tl.to(
    dOfModal('.closeBtn, engagements'),
    {
      opacity: 1,
      duration: 0.5,
      delay: 0.1
    },
    0
  )

  return tl
}

export function closeModal(dOfModal, modalRef, thumbRef) {
  const rect = thumbRef.current.getBoundingClientRect()

  const tl = gsap.timeline({ defaults: { ease: 'none' } })

  tl.to(dOfModal('.modal-bg'), { backgroundColor: 'rgb(0 0 0 / 0%)' })

  const elements = [modalRef.current, dOfModal('.modal-bg')]
  tl.set(elements, { display: 'none', delay: 0.5 }, 0)

  tl.set(
    dOfModal('.inner-wrapper'),
    {
      position: 'absolute'
    },
    0
  )
  tl.to(
    dOfModal('.inner-wrapper'),
    {
      maxWidth: `${rect.width}px`,
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      scaleX: 1,
      scaleY: 1,
      xPercent: 0,
      duration: 0.5
    },
    0
  )

  tl.to(
    dOfModal('.closeBtn, .gradient, .engagements, .card'),
    {
      opacity: 0
    },
    0
  )

  return tl
}
