import React, { useState, useEffect } from 'react'
import ContentScroller from './ContentScroller.js'
import './App.css'
import { request } from './request/request.js'

function App() {
  const [titleIds, setTitleIds] = useState(null)

  useEffect(() => {
    search()
    async function search() {
      try {
        const response = await fetch(request[0].getNewUrl)
        if (response.ok === true) {
          const data = await response.json()
          console.log(data)
          const titleId = data.results.map(item => {
            const { id } = item
            return { titleId: id }
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
