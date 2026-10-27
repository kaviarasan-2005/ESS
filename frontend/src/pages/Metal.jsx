import React from 'react'
import Navbar from '../components/Navbar'
import MetalSamplesBannerSection from '../components/MetalSamplesBannerSection'
import Footer from '../components/Footer'
import MetalSamplesOverviewSection from '../components/MetalSamplesOverviewSection'
import MetalSamplesDetailsSection from '../components/MetalSamplesDetailsSection'

const Metal = () => {
  return (
    <>
    <Navbar/>
    <MetalSamplesBannerSection/>
    <MetalSamplesOverviewSection/>
    <MetalSamplesDetailsSection/>
    <Footer/>
    </>
  )
}

export default Metal