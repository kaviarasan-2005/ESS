import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HyosungBannerSection from '../components/HyosungBannerSection'
import HyosungOverviewSection from '../components/HyosungOverviewSection'
import HyosungDetailsSection from '../components/HyosungDetailsSection'

const Hyosung = () => {
  return (
    <>
    <Navbar/>
    <HyosungBannerSection/>
    <HyosungOverviewSection/>
    <HyosungDetailsSection/>
    <Footer/>
    </>
  )
}

export default Hyosung