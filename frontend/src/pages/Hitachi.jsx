import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HitachiBannerSection from '../components/HitachiBannerSection'
import HitachiOverviewSection from '../components/HitachiOverviewSection'
import HitachiDetailsSection from '../components/HitachiDetailsSection'

const Hitachi = () => {
  return (
    <>
    <Navbar/>
    <HitachiBannerSection/>
    <HitachiOverviewSection/>
    <HitachiDetailsSection/>
    <Footer/>
    
    </>
  )
}

export default Hitachi