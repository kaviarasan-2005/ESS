import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BartecBanner from '../components/BartecBanner'
import BartecOverviewSection from '../components/BartecOverviewSection'
import BartecDetailsSection from '../components/BartecDetailsSection'

const Bartec = () => {
  return (
    <>
    <Navbar/>
    <BartecBanner/>
    <BartecOverviewSection/>
    <BartecDetailsSection/>
    <Footer/>
    
    </>
  )
}

export default Bartec