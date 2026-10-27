import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MassNotificationBanner from '../components/MassNotificationBanner'
import MassNotificationOverview from '../components/MassNotificationOverview'
import MassNotificationApps from '../components/MassNotificationApps'
import MassNotificationCapabilities from '../components/MassNotificationCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const MassNotification = () => {
  return (
    <>
    <Navbar/>
    <MassNotificationBanner/>
    <MassNotificationOverview/>
    <MassNotificationApps/>
    <MassNotificationCapabilities/>
    <MichellCTASection/>
    <Footer/>
    </>
  )
}

export default MassNotification