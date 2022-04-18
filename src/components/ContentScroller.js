import { useState, useEffect } from 'react'
import ContentItem from './content-item/ContentItem.jsx'
import { ChevronLeft, ChevronRight } from './sliderBtns'

const ItemSpace = 15.3333333333 // was 110 - width of item (100px) + spacing (10px)

function ContentScroller({ titles, imageConfig }) {
  const [startIndex, setStart] = useState(0),
    [baseId, setBase] = useState(5000), // key prop
    [initial, setInitial] = useState(true),
    [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDisabled(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [isDisabled])

  // Build array to render: first six viewable
  // note: here 'next' is the end point
  const range = 6
  let first = startIndex % titles.length, // 0 .. 6
    next = startIndex + range, // 6 .. 12
    visible = titles
      .slice(first, next) // // 0 to 6 .. 6 - 12
      .map((content, i) => ({ content, id: baseId + i }))

  // Add additional seven to the end
  // note here 'next' is the start point for next 7 items
  for (let post = 0; post < range + 1; post++) {
    next = next % titles.length // 6 % 10  = 6
    // add ids to specific titles found by idx
    visible.push({ content: titles[next], id: baseId + post + range })
    next++
  }

  // after initial - add previous 7 items
  if (!initial) {
    next = first - 1
    // incremenent by 7
    for (let pre = 0; pre < range + 1; pre++) {
      next = (next + titles.length) % titles.length
      visible.unshift({ content: titles[next], id: baseId - (pre + 1) })
      next--
    }
  }

  // Setting positions
  visible[0].position = 4 - (initial ? 0 : (range + 1) * ItemSpace)
  visible.forEach((item, i) => {
    if (i > 0) item.position = visible[i - 1].position + ItemSpace
    // skip the first item, then take prev position and add itemSpace
  })

  // Now render the items and the 'forward' and 'back' buttons.

  return (
    <>
      <div className={'ContentScroller' + (initial ? ' initial' : '')}>
        {visible.map(item => {
          return (
            <ContentItem
              content={item.content}
              style={{ left: item.position + '%' }}
              key={item.id}
              isDisabled={isDisabled}
              imageConfig={imageConfig}
            />
          )
        })}
        <button
          type="button"
          className={'view-previous' + (!initial ? ' visible' : '')}
          onClick={viewPrevious}
          disabled={isDisabled}
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className="view-next"
          onClick={viewNext}
          disabled={isDisabled}
        >
          <ChevronRight />
        </button>
      </div>
    </>
  )

  // Event handlers
  // set new startIndex and new base (key)

  function viewNext() {
    setIsDisabled(true)

    let next = startIndex + range, // 6
      base = baseId + range // 5000 + 6

    // if else n/a for current array
    if (next === titles.length) next = 0
    // If next + range brings us to a value greater than titles.length,
    else if (next + range > titles.length) {
      next = titles.length - range // 4
      base = baseId + (next - startIndex) // 6
    }
    setStart(next) // 6
    setBase(base) // 5012
    setInitial(false)
  }

  function viewPrevious() {
    setIsDisabled(true)
    let next = (startIndex === 0 ? titles.length : startIndex) - range,
      base = baseId - range
    if (next < 0) {
      next = 0
      base = baseId - startIndex
    }
    setStart(next)
    setBase(base)
  }
}

export default ContentScroller
