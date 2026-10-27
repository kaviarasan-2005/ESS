import React from 'react'
import AgcInstrumentsBanner from '../components/AgcInstrumentsBanner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AgcOverviewSection from '../components/AgcOverviewSection'
import AgcSolutionsSupportSection from '../components/AgcSolutionsSupportSection'

const AgcInstruments = () => {
  return (
    <>
    <Navbar/>
    <AgcInstrumentsBanner/>
    <AgcOverviewSection/>
    <AgcSolutionsSupportSection/>
    <Footer/>
    </>
  )
}

export default AgcInstruments