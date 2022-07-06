import React, { useState, useEffect } from 'react'
import ContentScroller from './components/ContentScroller.js'
import './App.css'
import { request, baseUrl, API_KEY } from './request/request.js'

let baseImageUrl, imageSizes

function App() {
  const [titleIds, setTitleIds] = useState(null)

  useEffect(() => {
    getConfig()
    // getConfig() fetches the secure_base_url and image sizes data which are the two initial pieces of data necessary for assembling a fully qualified image url.
    async function getConfig() {
      let configUrl = `${baseUrl}configuration?${API_KEY}`
      try {
        const response = await fetch(configUrl)
        if (response.ok === true) {
          const data = await response.json()
          baseImageUrl = data.images.secure_base_url
          imageSizes = data.images.backdrop_sizes
        } else {
          console.log(
            'Server doing its thing, it is you my friend who hath madeth a mithtake'
          )
        }
      } catch (error) {
        console.log(`Config ${error}`)
      }
    }
    getSelection()
    // getSelection() fetches title ids of the specified category. The url to make this fetch is imported from request/request.js
    async function getSelection() {
      try {
        const response = await fetch(request[0].getNewMoviesUrl)
        if (response.ok === true) {
          const data = await response.json()
          const titleId = data.results.map(item => {
            const { id } = item
            return { titleId: id }
          })
          setTitleIds(titleId)
        } else {
          console.log('What is happening?')
        }
      } catch (error) {
        console.log(`getNew ${error}`)
      }
    }
  }, [])

  return (
    <div className="App">
      {/* Rendering: Since ContentScroller passes in fetched data, it is rendered conditionally. */}
      {titleIds ? (
        <ContentScroller
          titles={titleIds}
          imageConfig={{ baseImageUrl, imageSizes }}
        />
      ) : (
        <p>Loading</p>
      )}
    </div>
  )
}

export default App
