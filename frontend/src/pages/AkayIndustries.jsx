import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AkayBanner from '../components/AkayBanner'
import AkayOverview from '../components/AkayOverview'
import AkayDetailsSection from '../components/AkayDetailsSection'

const AkayIndustries = () => {
  return (
    <>
     <Navbar/>
     <AkayBanner/>
     <AkayOverview/>
     <AkayDetailsSection/>
     <Footer/>
    </>
  )
}

export default AkayIndustries