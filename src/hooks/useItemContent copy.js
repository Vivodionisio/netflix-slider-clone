import { useState, useEffect } from 'react'
import { baseUrl, API_KEY } from '../request/request'

const cache = new Map()

const defaultItem = {
  backdrop_path: '',
  certification: '',
  genres: [
    { id: 1, name: '' },
    { id: 2, name: '' },
    { id: 3, name: '' }
  ],
  original_title: '',
  overview: '',
  release_dates: {
    results: [
      {
        iso_3166_1: '',
        release_dates: [
          {
            certification: '',
            iso_639_1: '',
            note: '',
            release_date: '',
            type: 1
          }
        ]
      }
    ]
  },
  runtime: 1
}

export default function useItemContent(itemId) {
  const [title, setTitle] = useState(cache.get(itemId) || defaultItem)

  useEffect(() => {
    if (cache.has(itemId)) return
    getInfo()
    async function getInfo() {
      const getInfoUrl = `${baseUrl}movie/${itemId}?${API_KEY}&append_to_response=release_dates`
      try {
        const response = await fetch(getInfoUrl)
        const data = await response.json()
        cache.set(itemId, data)
        setTitle(data)
      } catch (error) {
        console.error(`Get info ${error}`)
      }
    }
  }, [itemId])

  return title
}
