import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProcessInstrumentationBanner from '../components/ProcessInstrumentationBanner'
import ProcessInstrumentationOverviewSection from '../components/ProcessInstrumentationOverviewSection'
import ProcessInstrumentationApps from '../components/ProcessInstrumentationApps'
import ProcessInstrumentationCapabilitiesSection from '../components/ProcessInstrumentationCapabilitiesSection'
import MichellCTASection from '../components/MichellCTASection'

const ProcessInstrumentation = () => {
  return (
    <>
    <Navbar/>
    <ProcessInstrumentationBanner/>
    <ProcessInstrumentationOverviewSection/>
    <ProcessInstrumentationApps/>
    <ProcessInstrumentationCapabilitiesSection/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default ProcessInstrumentation