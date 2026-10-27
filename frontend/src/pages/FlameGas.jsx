import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FlameGasBanner from '../components/FlameGasBanner'
import FlameGasOverviewSection from '../components/FlameGasOverviewSection'
import FlameGasApplicationsSection from '../components/FlameGasApplicationsSection'
import FlameGasCapabilitiesSection from '../components/FlameGasCapabilitiesSection'
import MichellCTASection from '../components/MichellCTASection'

const FlameGas = () => {
  return (
    <>
    <Navbar/>
    <FlameGasBanner/>
    <FlameGasOverviewSection/>
    <FlameGasApplicationsSection/>
    <FlameGasCapabilitiesSection/>
    <MichellCTASection/>
    <Footer/>
    
    </>
  )
}

export default FlameGas