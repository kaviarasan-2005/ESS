import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AnalyzerSystemsBanner from '../components/AnalyzerSystemsBanner'
import AnalyzerSystemsOverview from '../components/AnalyzerSystemsOverview'
import AnalyzerSystemsApps from '../components/AnalyzerSystemsApps'
import AnalyzerSystemsCapabilities from '../components/AnalyzerSystemsCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const AnalyzerSystems = () => {
  return (
    <>
    <Navbar/>
    <AnalyzerSystemsBanner/>
    <AnalyzerSystemsOverview/>
    <AnalyzerSystemsApps/>
    <AnalyzerSystemsCapabilities/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default AnalyzerSystems