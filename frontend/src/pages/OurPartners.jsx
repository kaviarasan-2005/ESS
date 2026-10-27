import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import OurPartnersHero from '../components/OurPartnersHero'
import PartnersOverviewSection from '../components/PartnersOverviewSection'
import CategorizedPartnersSection from '../components/CategorizedPartnersSection'
import PartnerCtaSection from '../components/PartnerCtaSection'

const OurPartners = () => {
  return (
    <>
    <Navbar/>
    <OurPartnersHero/>
    <PartnersOverviewSection/>
    <CategorizedPartnersSection/>
    <PartnerCtaSection/>
    <Footer/>
    
    </>
  )
}

export default OurPartners