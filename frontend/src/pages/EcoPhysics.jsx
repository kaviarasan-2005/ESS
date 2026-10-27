import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EcoPhysicsBanner from '../components/EcoPhysicsBanner'
import EcoPhysicsOverviewSection from '../components/EcoPhysicsOverviewSection'
import EcoPhysicsPrecisionSection from '../components/EcoPhysicsPrecisionSection'
import EcoPhysicsRangeSupportSection from '../components/EcoPhysicsRangeSupportSection'

const EcoPhysics = () => {
  return (
    <>
    <Navbar/>
    <EcoPhysicsBanner/>
    <EcoPhysicsOverviewSection/>
    <EcoPhysicsPrecisionSection/>
    <EcoPhysicsRangeSupportSection/>
    <Footer/>
    </>
  )
}

export default EcoPhysics