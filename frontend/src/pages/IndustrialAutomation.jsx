import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import IndustrialAutomationBanner from '../components/IndustrialAutomationBanner'
import IndustrialAutomationOverview from '../components/IndustrialAutomationOverview'
import IndustrialAutomationApps from '../components/IndustrialAutomationApps'
import IndustrialAutomationCapabilities from '../components/IndustrialAutomationCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const IndustrialAutomation = () => {
  return (
    <>
    <Navbar/>
    <IndustrialAutomationBanner/>
    <IndustrialAutomationOverview/>
    <IndustrialAutomationApps/>
    <IndustrialAutomationCapabilities/>
    <MichellCTASection/>
    <Footer/>
    
    </>
  )
}

export default IndustrialAutomation