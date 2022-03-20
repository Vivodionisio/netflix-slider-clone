import { useState, useEffect } from 'react'
import { baseUrl, API_KEY } from './request/request.js'

let baseImageUrl = null
let imageSizes = null

export default function useImgConfig() {
  const [config, setConfig] = useState()

  useEffect(() => {
    getConfig()
    async function getConfig() {
      let url = `${baseUrl}configuration?${API_KEY}`
      try {
        const response = await fetch(url)
        if (response.ok === true) {
          const data = await response.json()
          baseImageUrl = data.images.secure_base_url
          imageSizes = data.images.backdrop_sizes
          setConfig({ baseImageUrl, imageSizes })
        } else {
          console.log(
            'Server doing its thing, but you my friend, have done something wrong!'
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  return [config, setConfig]
}
