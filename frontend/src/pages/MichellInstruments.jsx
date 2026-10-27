import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MichellBanner from '../components/MichellBanner'
import MichellOverview from '../components/MichellOverview'
import MichellDetails from '../components/MichellDetails'

const MichellInstruments = () => {
  return (
    <>
    <Navbar/>
    <MichellBanner/>
    <MichellOverview/>
    <MichellDetails/>
    <Footer/>
    </>
  )
}

export default MichellInstruments