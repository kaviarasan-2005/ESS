import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductHero from '../components/ProductHero'
import ProductsOverviewSection from '../components/ProductsOverviewSection'
import ProductGridSection from '../components/ProductGridSection'

const Products = () => {
  return (
    <>
    <Navbar/>
    <ProductHero/>
    <ProductsOverviewSection/>
    <ProductGridSection/>
    <Footer/>
    </>
  )
}

export default Products