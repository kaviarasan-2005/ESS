import React from 'react'
import Navbar from '../components/Navbar'
import SamplingSystemsBanner from '../components/SamplingSystemsBanner'
import Footer from '../components/Footer'
import SamplingSystemsOverview from '../components/SamplingSystemsOverview'
import SamplingSystemsApps from '../components/SamplingSystemsApps'
import SamplingSystemsCapabilities from '../components/SamplingSystemsCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const SamplingSystems = () => {
  return (
    <>
    <Navbar/>
    <SamplingSystemsBanner/>
    <SamplingSystemsOverview/>
    <SamplingSystemsApps/>
    <SamplingSystemsCapabilities/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default SamplingSystems