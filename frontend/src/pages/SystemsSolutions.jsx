import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SystemsSolutionsHeaderBanner from '../components/SystemsSolutionsHeaderBanner'
import SystemsOverviewSection from '../components/SystemsOverviewSection'
import SystemsSolutionsGrid from '../components/SystemsSolutionsGrid'

const SystemsSolutions = () => {
  return (
    <>
    <Navbar/>
    <SystemsSolutionsHeaderBanner/>
    <SystemsOverviewSection/>
    <SystemsSolutionsGrid/>
    <Footer/>
    
    </>
  )
}

export default SystemsSolutions