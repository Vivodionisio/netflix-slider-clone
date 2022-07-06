/*
For each ContentItem this useItemContent hook is called, passing in the itemId which has come from our initial API call in App.js, passed down through ContentScroller to each ContentItem.

The purpose of the hook is to fetch all the data related to the itemId that's necessary to populate the ContentItem. With performance in mind and to account for further lists of presentations which may later be added and contain duplicates, a Map object it used to store the data fetched. The API called is only made if the data isn't already in the cache.    
*/

import { useState, useEffect } from 'react'
import { baseUrl, API_KEY } from '../request/request'

const cache = new Map()

// defaultItem used as otherwise first render will cause an error and break.
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
      cache.get(itemId).then(data => {
        setTitle(data)
      })
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

/*
If the cache doesn't already contain an item with a key of itemId, we add itemId as the key of a new item, its give as its value a Promise in which the fetch call is made. 

If an additional call is made with the same itemId, it will find the id in the cache and wait or if the promise has resolved, pass the value (data) to setTitle. Multiple threads can wait for the promised value. 
*/
