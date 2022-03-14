import React, { useState, useEffect } from 'react'
import ContentScroller from './ContentScroller.js'
import './App.css'
import { request, baseUrl, API_KEY } from './request/request.js'

let baseImageUrl = null
let imageSize = null

function App() {
  const [titles, setTitles] = useState(null)

  useEffect(() => {
    getConfig()
    async function getConfig() {
      let url = `${baseUrl}configuration?${API_KEY}`
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
        const response = await fetch(request[0].getNewUrl)
        if (response.ok === true) {
          const data = await response.json()
          const titlesList = data.results.map(item => {
            const { original_title, backdrop_path, id } = item
            const imageUrl = baseImageUrl + imageSize + backdrop_path
            return { title: original_title, image: imageUrl, titleId: id }
          })
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
