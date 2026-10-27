import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FireGasBanner from '../components/FireGasBanner'
import FireGasOverview from '../components/FireGasOverview'
import FireGasApps from '../components/FireGasApps'
import FireGasCapabilities from '../components/FireGasCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const FireGas = () => {
  return (
    <>
    <Navbar/>
    <FireGasBanner/>
    <FireGasOverview/>
    <FireGasApps/>
    <FireGasCapabilities/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default FireGas