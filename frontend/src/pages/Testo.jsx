import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TestoBanner from '../components/TestoBanner'
import TestoOverviewSection from '../components/TestoOverviewSection'
import TestoDetailsSection from '../components/TestoDetailsSection'

const Testo = () => {
  return (
    <>
    <Navbar/>
    <TestoBanner/>
    <TestoOverviewSection/>
    <TestoDetailsSection/>
    <Footer/>
    </>
  )
}

export default Testo