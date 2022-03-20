import { useState, useEffect } from 'react'
import { getReleaseData, baseUrl, API_KEY } from './request/request'

const {
  path: { movies, releaseDates }
} = getReleaseData

const cache = new Map([[]])

let baseImageUrl, imageSizes, certification
export default function useItemContent(titleId) {
  const [title, setTitle] = useState(() => {
    return cache.get(titleId) || ''
  })

  useEffect(() => {
    if (cache.has(titleId)) return

    getConfig()
    async function getConfig() {
      let configUrl = `${baseUrl}configuration?${API_KEY}`
      try {
        const response = await fetch(configUrl)
        if (response.ok === true) {
          const data = await response.json()
          baseImageUrl = data.images.secure_base_url
          imageSizes = data.images.backdrop_sizes
          getReleaseInfo()
        } else {
          console.log(
            'Server doing its thing, but you my friend, have done something wrong!'
          )
        }
      } catch (error) {
        console.log(error)
      }
    }

    async function getReleaseInfo() {
      const getReleaseInfoUrl = `${
        baseUrl + movies + titleId
      }/${releaseDates}?${API_KEY}`
      try {
        const response = await fetch(getReleaseInfoUrl)
        if (response.ok === true) {
          const data = await response.json()
          const releaseInfoGB = data.results.filter(
            result => result.iso_3166_1 === 'GB'
          )
          certification = releaseInfoGB[0].release_dates[0].certification
          getInfo()
        } else {
          console.log('No technical errors, but something when wrong.. ?')
        }
      } catch (error) {
        console.error(error)
      }
    }

    async function getInfo() {
      const getInfoUrl = `${baseUrl}${movies}${titleId}?${API_KEY}`
      try {
        const response = await fetch(getInfoUrl)
        if (response.ok === true) {
          const data = await response.json()
          const { backdrop_path, genres, original_title, overview, runtime } =
            data
          const titleInfo = {
            baseImageUrl,
            backdrop_path,
            certification,
            genres,
            imageSizes,
            original_title,
            overview,
            runtime
          }

          cache.set(titleId, titleInfo)
          setTitle(titleInfo)
        } else {
          console.log('No technical errors, but something when wrong.. ?')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }, [])

  return [title]
}

// what do I need?

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
