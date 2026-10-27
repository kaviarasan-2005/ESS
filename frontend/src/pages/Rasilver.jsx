import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import RASilverBanner from '../components/RASilverBanner'
import RASilverOverviewSection from '../components/RASilverOverviewSection'
import RASilverDetailsSection from '../components/RASilverDetailsSection'

const Rasilver = () => {
  return (
    <>
    <Navbar/>
    <RASilverBanner/>
    <RASilverOverviewSection/>
    <RASilverDetailsSection/>
    <Footer/>
    </>
  )
}

export default Rasilver