import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VESDABanner from '../components/VESDABanner'
import VESDAOverviewSection from '../components/VESDAOverviewSection'
import VESDAApplicationsSection from '../components/VESDAApplicationsSection'
import VESDACapabilitiesSection from '../components/VESDACapabilitiesSection'
import MichellCTASection from '../components/MichellCTASection'

const VESDA = () => {
  return (
    <>
    <Navbar/>
    <VESDABanner/>
    <VESDAOverviewSection/>
    <VESDAApplicationsSection/>
    <VESDACapabilitiesSection/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default VESDA