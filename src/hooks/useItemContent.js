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
  const [title, setTitle] = useState(defaultItem)
  useEffect(() => {
    if (cache.has(itemId)) {
      cache.get(itemId).then(data => setTitle(data))
    } else {
      cache.set(
        itemId,
        new Promise((resolve, reject) => {
          window
            .fetch(
              `${baseUrl}movie/${itemId}?${API_KEY}&append_to_response=release_dates`
            )
            .then(rsp => (rsp.ok ? rsp.json() : Promise.reject(rsp.statusText)))
            .then(data => {
              resolve(data)
              setTitle(data)
            })
            .catch(err => reject(err))
        })
      )
    }
  }, [itemId])

  return title
}
