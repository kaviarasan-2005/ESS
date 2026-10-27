import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import CapabilitiesHeaderBanner from '../components/CapabilitiesHeaderBanner'
import CapabilitiesOverviewSection from '../components/CapabilitiesOverviewSection'
import ExecutionScopeSection from '../components/ExecutionScopeSection'
import WhyEssSection from '../components/WhyEssSection'
import MichellCTASection from '../components/MichellCTASection'

const Capabilities = () => {
  return (
    <>
    <Navbar/>
    <CapabilitiesHeaderBanner/>
    <CapabilitiesOverviewSection/>
    <ExecutionScopeSection/>
    <WhyEssSection/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default Capabilities