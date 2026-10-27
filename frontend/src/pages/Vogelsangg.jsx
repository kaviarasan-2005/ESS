import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import VogelsangBanner from '../components/VogelsangBanner'
import VogelsangOverviewSection from '../components/VogelsangOverviewSection'
import VogelsangDetailsSection from '../components/VogelsangDetailsSection'

const Vogelsangg = () => {
  return (
    <>
    <Navbar/>
    <VogelsangBanner/>
    <VogelsangOverviewSection/>
    <VogelsangDetailsSection/>
    <Footer/>
    </>
  )
}

export default Vogelsangg