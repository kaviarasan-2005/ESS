import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProcessAnalyzersBanner from '../components/ProcessAnalyzersBanner'
import ProcessAnalyzersOverviewSection from '../components/ProcessAnalyzersOverviewSection'
import ProcessAnalyzersApplicationsSection from '../components/ProcessAnalyzersApplicationsSection'
import ProcessAnalyzersCapabilitiesSection from '../components/ProcessAnalyzersCapabilitiesSection'
import MichellCTASection from '../components/MichellCTASection'

const ProcessAnalyzera = () => {
  return (
    <>
    <Navbar/>
    <ProcessAnalyzersBanner/>
    <ProcessAnalyzersOverviewSection/>
    <ProcessAnalyzersApplicationsSection/>
    <ProcessAnalyzersCapabilitiesSection/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default ProcessAnalyzera