import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EmersonBannerSection from '../components/EmersonBannerSection'
import EmersonOverviewSection from '../components/EmersonOverviewSection'
import EmersonDetailsSection from '../components/EmersonDetailsSection'

const Emerson = () => {
  return (
    <>
    <Navbar/>
    <EmersonBannerSection/>
    <EmersonOverviewSection/>
    <EmersonDetailsSection/>
    <Footer/>
    
    </>
  )
}

export default Emerson;