import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PanoramaBanner from '../components/PanoramaBanner'
import PanoramaOverviewSection from '../components/PanoramaOverviewSection'
import PanoramaDetailsSection from '../components/PanoramaDetailsSection'

const Panorama = () => {
  return (
    <>
    <Navbar/>
    <PanoramaBanner/>
    <PanoramaOverviewSection/>
    <PanoramaDetailsSection/>
    <Footer/>
    </>
  )
}

export default Panorama