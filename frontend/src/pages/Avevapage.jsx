import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AvevaBannerSection from '../components/AvevaBannerSection'
import AvevaOverviewSection from '../components/AvevaOverviewSection'
import AvevaSolutionsDetailsSection from '../components/AvevaSolutionsDetailsSection'

const Avevapage = () => {
  return (
    <>
    <Navbar/>
    <AvevaBannerSection/>
    <AvevaOverviewSection/>
    <AvevaSolutionsDetailsSection/>
    <Footer/>
    </>
  )
}

export default Avevapage