import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EatonMedcBanner from '../components/EatonMedcBanner'
import EatonMedcOverviewSection from '../components/EatonMedcOverviewSection'
import EatonMedcDetailsSection from '../components/EatonMedcDetailsSection'

const Eaton = () => {
  return (
    <>
    <Navbar/>
    <EatonMedcBanner/>
    <EatonMedcOverviewSection/>
    <EatonMedcDetailsSection/>
    <Footer/>
    </>
  )
}

export default Eaton;