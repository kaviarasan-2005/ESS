import React from 'react'
import Navbar from '../components/Navbar'
import MichellBannerSection from '../components/MichellBannerSection'
import Footer from '../components/Footer'
import MichellOverviewSection from '../components/MichellOverviewSection'
import MichellDetailsSection from '../components/MichellDetailsSection'
import PartnerCtaSection from '../components/PartnerCtaSection'
import MichellCapabilitiesSection from '../components/MichellCapabilitiesSection'
import MichellCTASection from '../components/MichellCTASection'

const Moisture = () => {
  return (
    <>
    <Navbar/>
    <MichellBannerSection/>
    <MichellOverviewSection/>
    <MichellDetailsSection/>
    <MichellCapabilitiesSection/>
    <MichellCTASection/>
    {/* <PartnerCtaSection/> */}
    <Footer/>
    
    </>
  )
}

export default Moisture