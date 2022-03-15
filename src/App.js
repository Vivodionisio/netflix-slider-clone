import React, { useState, useEffect } from 'react'
import ContentScroller from './ContentScroller.js'
import './App.css'
import { request, baseUrl, API_KEY } from './request/request.js'

let baseImageUrl = null
let imageSize = null

function App() {
  const [titleIds, setTitleIds] = useState(null)

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
          console.log(data)
          const titleId = data.results.map(item => {
            const { original_title, backdrop_path, id } = item
            const imageUrl = baseImageUrl + imageSize + backdrop_path
            return { title: original_title, image: imageUrl, titleId: id }
          })
          setTitleIds(titleId)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }, [])

  return (
    <div className="App">
      {titleIds ? <ContentScroller titles={titleIds} /> : <p>Loading</p>}
    </div>
  )
}

export default App
