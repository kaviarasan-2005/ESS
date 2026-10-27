import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProminentBanner from '../components/ProminentBanner'
import ProminentOverviewSection from '../components/ProminentOverviewSection'
import ProminentDetailsSection from '../components/ProminentDetailsSection'

const Prominent = () => {
  return (
    <>
     <Navbar/>
     <ProminentBanner/>
     <ProminentOverviewSection/>
     <ProminentDetailsSection/>
     <Footer/>
    </>
  )
}

export default Prominent