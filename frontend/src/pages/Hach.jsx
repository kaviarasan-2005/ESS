import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HachBannerSection from '../components/HachBannerSection'
import HachOverviewSection from '../components/HachOverviewSection'
import HachDetailsSection from '../components/HachDetailsSection'

const Hach = () => {
  return (
    <>
    <Navbar/>
    <HachBannerSection/>
    <HachOverviewSection/>
    <HachDetailsSection/>
    <Footer/>
    
    </>
  )
}

export default Hach