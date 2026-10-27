import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HoneywellBannerSection from '../components/HoneywellBannerSection'
import HoneywellOverviewSection from '../components/HoneywellOverviewSection'
import HoneywellDetailsSection from '../components/HoneywellDetailsSection'

const Honeywell = () => {
  return (
    <>
    <Navbar/>
    <HoneywellBannerSection/>
    <HoneywellOverviewSection/>
    <HoneywellDetailsSection/>
    <Footer/>
    </>
  )
}

export default Honeywell