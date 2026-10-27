import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AfterSalesHeaderBanner from '../components/AfterSalesHeaderBanner'
import AfterSalesOverviewSection from '../components/AfterSalesOverviewSection'
import AfterSalesServiceScopeSection from '../components/AfterSalesServiceScopeSection'
import AfterSalesWhyUsSection from '../components/AfterSalesWhyUsSection'
import MichellCTASection from '../components/MichellCTASection'

const AfterSalesService = () => {
  return (
    <>
    <Navbar/>
    <AfterSalesHeaderBanner/>
    <AfterSalesOverviewSection/>
    <AfterSalesServiceScopeSection/>
    <AfterSalesWhyUsSection/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default AfterSalesService