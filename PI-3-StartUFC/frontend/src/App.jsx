import React from "react"
import { Outlet } from "react-router-dom"
import ScrollToTop from "../src/components/ScrollToTop/ScrollToTop"; 


function App() {

  return (
    <div className="App">

      <ScrollToTop />
      <Outlet/>
      
    </div>
  )
}


export default App
