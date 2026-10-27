import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import MissionVisionSection from '../components/MissionVisionSection'
import ProductsSection from '../components/ProductsSection'
import SolutionsSection from '../components/SolutionsSection'
import PartnersSection from '../components/PartnersSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
     <Navbar/>
     <HeroSection/>
     <AboutSection />
     <MissionVisionSection/>
     <ProductsSection/>
     <SolutionsSection/>
     {/* <PartnersSection/> */}
     <Footer/>
     
    </>
  )
}

export default Home;