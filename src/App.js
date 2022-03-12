import React, { useState, useEffect } from 'react'
import ContentScroller from './ContentScroller.js'
import './App.css'
import { request } from './request/request.js'

const API_KEY = 'f2edd756926fc9d78862d49600845a8d'
const baseUrl = 'https://api.themoviedb.org/3/'
let baseImageUrl = null
let imageSize = null

function App() {
  const [titles, setTitles] = useState(null)

  useEffect(() => {
    getConfig()
    async function getConfig() {
      let url = `${baseUrl}configuration?api_key=${API_KEY}`
      try {
        const response = await fetch(url)
        const data = await response.json()
        baseImageUrl = data.images.secure_base_url
        imageSize = data.images.backdrop_sizes[1]
        await search()
      } catch (error) {
        console.log(error)
      }
    }

    async function search() {
      try {
        const response = await fetch(request[0].getNew)
        if (response.ok === true) {
          const data = await response.json()
          const titlesList = data.results.map(item => {
            const { original_title, backdrop_path } = item
            const imageUrl = baseImageUrl + imageSize + backdrop_path
            console.log(imageUrl)
            return { title: original_title, image: imageUrl }
          })
          console.log(data)
          setTitles(titlesList)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  return (
    <div className="App">
      {titles ? <ContentScroller titles={titles} /> : <p>Loading</p>}
    </div>
  )
}

export default App

// const titles = [
//   { title: 'Midnight Mass', image: 'midnight-mass.jpg' },
//   { title: 'Archive81', image: 'archive81.jpg' },
//   { title: 'Better Than Us', image: 'better-than-us.jpg' },
//   { title: 'Stranger Things', image: 'stranger-things.jpg' },
//   { title: 'Black Spot', image: 'black-spot.jpg' },
//   { title: 'Dark', image: 'dark.jpg' },
//   { title: 'Wu Assassins', image: 'wu-assassins.jpg' },
//   { title: 'DC Titans', image: 'dc-titans.jpg' },
//   { title: 'Raising Dion', image: 'raising-dion.jpg' },
//   { title: 'Beyond', image: 'beyond.jpg' }
// ]
