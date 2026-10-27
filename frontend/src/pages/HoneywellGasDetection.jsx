import React from 'react'
import Navbar from '../components/Navbar'
import HoneywellGasDetectionBannerSection from '../components/HoneywellGasDetectionBannerSection'
import Footer from '../components/Footer'
import HoneywellGasDetectionOverviewSection from '../components/HoneywellGasDetectionOverviewSection'
import HoneywellGasDetectionDetailsSection from '../components/HoneywellGasDetectionDetailsSection'
import HoneywellGasDetectionIndustriesSection from '../components/HoneywellGasDetectionIndustriesSection'

const HoneywellGasDetection = () => {
  return (
    <>
    <Navbar/>
    <HoneywellGasDetectionBannerSection/>
    <HoneywellGasDetectionOverviewSection/>
    <HoneywellGasDetectionDetailsSection/>
    <HoneywellGasDetectionIndustriesSection/>
    <Footer/>
    </>
  )
}

export default HoneywellGasDetection