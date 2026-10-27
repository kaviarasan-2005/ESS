import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ContactHeroSection from '../components/ContactHeroSection'
import ContactSection from '../components/ContactSection'
import ContactMapsSection from '../components/ContactMapsSection'

const ContactUs = () => {
  return (
    <>
    <Navbar/>
    <ContactHeroSection/>
    <ContactSection/>
    {/* <ContactMapsSection/> */}
    <Footer/>
    
    </>
  )
}

export default ContactUs