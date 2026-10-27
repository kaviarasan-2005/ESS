import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TSIBanner from '../components/TSIBanner'
import TSIOverviewSection from '../components/TSIOverviewSection'
import TSIDetailsSection from '../components/TSIDetailsSection'

const TSI = () => {
  return (
    <>
    <Navbar/>
    <TSIBanner/>
    <TSIOverviewSection/>
    <TSIDetailsSection/>
    <Footer/>
    </>
  )
}

export default TSI