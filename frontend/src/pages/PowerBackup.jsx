import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PowerBackupBanner from '../components/PowerBackupBanner'
import PowerBackupOverview from '../components/PowerBackupOverview'
import PowerBackupApps from '../components/PowerBackupApps'
import PowerBackupCapabilities from '../components/PowerBackupCapabilities'
import MichellCTASection from '../components/MichellCTASection'

const PowerBackup = () => {
  return (
    <>
    <Navbar/>
    <PowerBackupBanner/>
    <PowerBackupOverview/>
    <PowerBackupApps/>
    <PowerBackupCapabilities/>
    <MichellCTASection/>
    <Footer/>
    
    </>
  )
}

export default PowerBackup