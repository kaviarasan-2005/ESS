import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import UpstreamBanner from '../components/UpstreamBanner'
import UpstreamOverview from '../components/UpstreamOverview'
import UpstreamApps from '../components/UpstreamApps'
import UpstreamCapabilities from '../components/UpstreamCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const Upstream = () => {
  return (
    <>
    <Navbar/>
    <UpstreamBanner/>
    <UpstreamOverview/>
    <UpstreamApps/>
    <UpstreamCapabilities/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default Upstream