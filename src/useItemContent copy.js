import { useState, useEffect } from 'react'
import { getReleaseData } from './request/request'

const {
  baseUrl,
  path: { movies, releaseDates },
  API_KEY
} = getReleaseData

const cache = new Map([[]])

function getCachedItem(titleId) {
  const item = cache.get(titleId)
  console.log(item)
}

export default function useItemContent(titleId) {
  const [titleData, setTitleData] = useState(() => {
    return getCachedItem(titleId)
  })

  useEffect(() => {
    const url = `${baseUrl}${movies}${titleId}?${API_KEY}`
    getInfo()
    async function getInfo() {
      try {
        const response = await fetch(url)
        if (response.ok === true) {
          const data = await response.json()
          // console.log(data)
          cache.set(titleId, data)
          // setTitle(data)
        } else {
          console.log('No technical errors, but something when wrong.. ?')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, [titleData])

  return [titleData, setTitleData]
}

// what do it need?

// small image for slider
// large image for 'get more info'

// genres
// maturity rating (and desc)

// duration
// format

// descriptive tags
// cast
// name
// description

// writer
// director
