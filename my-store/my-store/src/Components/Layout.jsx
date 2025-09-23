import React from "react"
import AppRoutes from "./AppRoutes"
import { BrowserRouter } from "react-router-dom"
const Layout = () => {
  return (
    <>
    <BrowserRouter>
     <AppRoutes/>
    </BrowserRouter>
    </>
  )
}

export default Layout
