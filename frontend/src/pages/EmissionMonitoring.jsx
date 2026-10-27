import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EmissionMonitoringBanner from '../components/EmissionMonitoringBanner'
import EmissionMonitoringOverview from '../components/EmissionMonitoringOverview'
import EmissionMonitoringApps from '../components/EmissionMonitoringApps'
import EmissionMonitoringCapabilities from '../components/EmissionMonitoringCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const EmissionMonitoring = () => {
  return (
    <>
    <Navbar/>
    <EmissionMonitoringBanner/>
    <EmissionMonitoringOverview/>
    <EmissionMonitoringApps/>
    <EmissionMonitoringCapabilities/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default EmissionMonitoring