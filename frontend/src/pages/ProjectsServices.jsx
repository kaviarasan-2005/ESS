import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProjectsServicesHeaderBanner from '../components/ProjectsServicesHeaderBanner'
import ProjectsServicesOverviewSection from '../components/ProjectsServicesOverviewSection'
import ProjectsServicesGrid from '../components/ProjectsServicesGrid'

const ProjectsServices = () => {
  return (
    <>
    <Navbar/>
    <ProjectsServicesHeaderBanner/>
    <ProjectsServicesOverviewSection/>
    <ProjectsServicesGrid/>
    <Footer/>
    </>
  )
}

export default ProjectsServices