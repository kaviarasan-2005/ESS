import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BeaconsSoundersBanner from '../components/BeaconsSoundersBanner'
import BeaconsSoundersOverview from '../components/BeaconsSoundersOverview'
import BeaconsSoundersApps from '../components/BeaconsSoundersApps'
import BeaconsSoundersCapabilities from '../components/BeaconsSoundersCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const BeaconsSounders = () => {
  return (
    <>
    <Navbar/>
    <BeaconsSoundersBanner/>
    <BeaconsSoundersOverview/>
    <BeaconsSoundersApps/>
    <BeaconsSoundersCapabilities/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default BeaconsSounders