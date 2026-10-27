import { useState, useLayoutEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Public Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Products from './pages/Products';
import OurPartners from './pages/OurPartners';
import ContactUs from './pages/ContactUs';
import ScrollToTop from './components/ScrollToTop';

// Admin - Pages & Components
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminLayout from './admin/components/AdminLayout';
import AdminForgotPassword from './admin/pages/AdminForgotPassword';

// Admin - Global Components Editors
import AdminNavbar from './admin/global/AdminNavbar';
import AdminFooterEditor from './admin/global/AdminFooterEditor';

// Admin - Home Page Section Editors
import AdminHeroEditor from './admin/home/AdminHeroEditor';
import AdminAboutEditor from './admin/home/AdminAboutEditor';
import AdminMissionVisionEditor from './admin/home/AdminMissionVisionEditor';
import AdminProductsEditor from './admin/home/AdminProductsEditor';
import AdminSolutionsEditor from './admin/home/AdminSolutionsEditor';
import AdminPartnersEditor from './admin/home/AdminPartnersEditor';

// Admin - About Page Editors
import AdminAboutHeaderEditor from './admin/About/AdminAboutHeaderEditor';
import AdminStoryEditor from './admin/About/AdminStoryEditor';
import AdminSpecializedDivisionsEditor from './admin/About/AdminSpecializedDivisionsEditor';

// Admin - Product Page Editors
import AdminProductsHeroEditor from './admin/Produts/AdminProductsEditor';
import AdminProductsOverviewEditor from './admin/Produts/AdminProductsOverviewEditor';
import AdminProductCategoriesEditor from './admin/Produts/AdminProductCategoriesEditor';

// Admin - Partners Page Editors
import AdminPartnersHeroEditor from './admin/Partners/AdminPartnersHeroEditor';
import AdminPartnersOverviewEditor from './admin/Partners/AdminPartnersOverviewEditor';
import AdminCategorizedPartnersEditor from './admin/Partners/AdminCategorizedPartnersEditor';
import AdminPartnerCtaEditor from './admin/Partners/AdminPartnerCtaEditor';
import AdminAGCBannerEditor from './admin/Partners/AdminAGCBannerEditor'; // Added AGC Banner Editor

// Admin - Contact Page Editors
import AdminContactHeroEditor from './admin/Contact/AdminContactHeroEditor';
import AdminContactOverviewEditor from './admin/Contact/AdminContactOverviewEditor';
import AdminContactMapsEditor from './admin/Contact/AdminContactMapsEditor';

// Floating Widgets
import ScrollToTopButton from './components/ScrollToTopButton';
import WhatsAppButton from './components/Whatsappbutton';
import AgcInstrumentsBanner from './components/AgcInstrumentsBanner';
import AgcInstruments from './pages/AgcInstruments';
import AdminAGCOverviewEditor from './admin/Partners/AdminAGCOverviewEditor';
import AdminAGCSolutionsSupportEditor from './admin/Partners/AdminAGCSolutionsSupportEditor';
import AkayIndustries from './pages/AkayIndustries';
import AdminAKAYBannerEditor from './admin/Partners/AdminAKAYBannerEditor';
import AdminAKAYOverviewEditor from './admin/Partners/AdminAKAYOverviewEditor';
import AdminAkayDetailsEditor from './admin/Partners/AdminAkayDetailsEditor';
import AdminAvevaBannerEditor from './admin/Partners/AdminAvevaBannerEditor';
import Avevapage from './pages/Avevapage';
import AdminAvevaOverviewEditor from './admin/Partners/AdminAvevaOverviewEditor';
import AdminAvevaDetailsEditor from './admin/Partners/AdminAvevaDetailsEditor';
import Bartec from './pages/Bartec';
import AdminBartecBannerEditor from './admin/Partners/AdminBartecBannerEditor';
import AdminBartecOverviewEditor from './admin/Partners/AdminBartecOverviewEditor';
import AdminBartecDetailsEditor from './admin/Partners/AdminBartecDetailsEditor';
import Eaton from './pages/Eaton';
import AdminEatonMedcBannerEditor from './admin/Partners/AdminEatonMedcBannerEditor';
import AdminEatonMedcOverviewEditor from './admin/Partners/AdminEatonMedcOverviewEditor';
import AdminEatonMedcDetailsEditor from './admin/Partners/AdminEatonMedcDetailsEditor';
import EcoPhysics from './pages/EcoPhysics';
import AdminEcoPhysicsBannerEditor from './admin/Partners/AdminEcoPhysicsBannerEditor';
import AdminRegister from './admin/pages/AdminRegister';
import EcoPhysicsOverviewAdminEditor from './admin/Partners/EcoPhysicsOverviewAdminEditor';
import EcoPhysicsPrecisionAdminEditor from './admin/Partners/EcoPhysicsPrecisionAdminEditor';
import EcoPhysicsRangeSupportAdminEditor from './admin/Partners/EcoPhysicsRangeSupportAdminEditor';
import Emerson from './pages/Emerson';
import EmersonBannerAdminEditor from './admin/Partners/EmersonBannerAdminEditor';
import AdminEmersonOverviewEditor from './admin/Partners/AdminEmersonOverviewEditor';
import AdminEmersonDetailsEditor from './admin/Partners/AdminEmersonDetailsEditor';
import Hach from './pages/Hach';
import AdminHachBannerEditor from './admin/Partners/AdminHachBannerEditor';
import AdminHachOverviewEditor from './admin/Partners/AdminHachOverviewEditor';
import AdminHachDetailsEditor from './admin/Partners/AdminHachDetailsEditor';
import AdminHitachiBannerEditor from './admin/Partners/AdminHitachiBannerEditor';
import Hitachi from './pages/Hitachi';
import AdminHitachiOverviewEditor from './admin/Partners/AdminHitachiOverviewEditor';
import AdminHitachiDetailsEditor from './admin/Partners/AdminHitachiDetailsEditor';
import Hyosung from './pages/Hyosung';
import AdminHyosungBannerEditor from './admin/Partners/AdminHyosungBannerEditor';
import AdminHyosungOverviewEditor from './admin/Partners/AdminHyosungOverviewEditor';
import AdminHyosungDetailsEditor from './admin/Partners/AdminHyosungDetailsEditor';
import Moisture from './pages/Moisture';
import AdminMichellBannerEditor from './admin/Produts/AdminMichellBannerEditor';
import AdminMichellOverviewEditor from './admin/Produts/AdminMichellOverviewEditor';
import AdminMichellDetailsEditor from './admin/Produts/AdminMichellDetailsEditor';
import Honeywell from './pages/Honeywell';
import AdminHoneywellBannerEditor from './admin/Partners/AdminHoneywellBannerEditor';
import AdminHoneywellOverviewEditor from './admin/Partners/AdminHoneywellOverviewEditor';
import AdminHoneywellDetailsEditor from './admin/Partners/AdminHoneywellDetailsEditor';
import AdminHoneywellGasDetectionBannerEditor from './admin/Partners/AdminHoneywellGasDetectionBannerEditor';
import HoneywellGasDetection from './pages/HoneywellGasDetection';
import AdminHoneywellGasDetectionOverviewEditor from './admin/Partners/AdminHoneywellGasDetectionOverviewEditor';
import AdminHoneywellGasDetectionDetailsEditor from './admin/Partners/AdminHoneywellGasDetectionDetailsEditor';
import AdminHoneywellGasDetectionIndustriesEditor from './admin/Partners/AdminHoneywellGasDetectionIndustriesEditor';
import MetalSamplesBannerEditor from './admin/Partners/MetalSamplesBannerEditor';
import Metal from './pages/Metal';
import MetalSamplesOverviewEditor from './admin/Partners/MetalSamplesOverviewEditor';
import MetalSamplesDetailsEditor from './admin/Partners/MetalSamplesDetailsEditor';
import MichellInstruments from './pages/MichellInstruments';
import MichellBannerEditor from './admin/Partners/MichellBannerEditor';
import MichellOverviewEditor from './admin/Partners/MichellOverviewEditor';
import MichellDetailsEditor from './admin/Partners/MichellDetailsEditor';
import Panorama from './pages/Panorama';
import PanoramaBannerEditor from './admin/Partners/PanoramaBannerEditor';
import Preloader from './components/Preloader';
import PanoramaOverviewEditor from './admin/Partners/PanoramaOverviewEditor';
import PanoramaDetailsEditor from './admin/Partners/PanoramaDetailsEditor';
import Prominent from './pages/Prominent';
import ProminentBannerEditor from './admin/Partners/ProminentBannerEditor';
import ProminentOverviewEditor from './admin/Partners/ProminentOverviewEditor';
import ProminentDetailsEditor from './admin/Partners/ProminentDetailsEditor';
import Rasilver from './pages/Rasilver';
import RASilverBannerEditor from './admin/Partners/RASilverBannerEditor';
import RASilverOverviewEditor from './admin/Partners/RASilverOverviewEditor';
import RASilverDetailsEditor from './admin/Partners/RASilverDetailsEditor';
import Testo from './pages/Testo';
import TestoBannerEditor from './admin/Partners/TestoBannerEditor';
import TestoOverviewEditor from './admin/Partners/TestoOverviewEditor';
import MichellCapabilitiesEditor from './admin/Produts/MichellCapabilitiesEditor';
import MichellCTAEditor from './admin/Produts/MichellCTAEditor';
import TestoDetailsEditor from './admin/Partners/TestoDetailsEditor';
import TSIBannerEditor from './admin/Partners/TSIBannerEditor';
import TSI from './pages/TSI';
import TSIOverviewEditor from './admin/Partners/TSIOverviewEditor';
import TSIDetailsEditor from './admin/Partners/TSIDetailsEditor';
import Vogelsangg from './pages/Vogelsangg';
import VogelsangBannerEditor from './admin/Partners/VogelsangBannerEditor';
import VogelsangOverviewEditor from './admin/Partners/VogelsangOverviewEditor';
import VogelsangDetailsEditor from './admin/Partners/VogelsangDetailsEditor';
import FlameGas from './pages/FlameGas';
import FlameGasBannerEditor from './admin/Produts/FlameGasBannerEditor';
import FlameGasOverviewEditor from './admin/Produts/FlameGasOverviewEditor';
import FlameGasApplicationsEditor from './admin/Produts/FlameGasApplicationsEditor';
import FlameGasCapabilitiesEditor from './admin/Produts/FlameGasCapabilitiesEditor';
import VESDA from './pages/VESDA';
import VESDABannerEditor from './admin/Produts/VESDABannerEditor';
import VESDAOverviewEditor from './admin/Produts/VESDAOverviewEditor';
import VESDAApplicationsEditor from './admin/Produts/VESDAApplicationsEditor';
import VESDACapabilitiesEditor from './admin/Produts/VESDACapabilitiesEditor';
import ProcessAnalyzera from './pages/ProcessAnalyzera';
import ProcessAnalyzersBannerEditor from './admin/Produts/ProcessAnalyzersBannerEditor';
import ProcessAnalyzersOverviewEditor from './admin/Produts/ProcessAnalyzersOverviewEditor';
import ProcessAnalyzersApplicationsEditor from './admin/Produts/ProcessAnalyzersApplicationsEditor';
import ProcessAnalyzersCapabilitiesEditor from './admin/Produts/ProcessAnalyzersCapabilitiesEditor';
import ProcessInstrumentation from './pages/ProcessInstrumentation';
import ProcessInstrumentationBannerEditor from './admin/Produts/ProcessInstrumentationBannerEditor';
import ProcessInstrumentationOverviewEditor from './admin/Produts/ProcessInstrumentationOverviewEditor';
import ProcessInstrumentationAppsEditor from './admin/Produts/ProcessInstrumentationAppsEditor';
import ProcessInstrumentationCapabilitiesEditor from './admin/Produts/ProcessInstrumentationCapabilitiesEditor';
import Upstream from './pages/Upstream';
import UpstreamBannerEditor from './admin/Produts/UpstreamBannerEditor';
import UpstreamOverviewEditor from './admin/Produts/UpstreamOverviewEditor';
import UpstreamAppsEditor from './admin/Produts/UpstreamAppsEditor';
import UpstreamCapabilitiesEditor from './admin/Produts/UpstreamCapabilitiesEditor';
import BeaconsSounders from './pages/BeaconsSounders';
import BeaconsSoundersBannerEditor from './admin/Produts/BeaconsSoundersBannerEditor';
import BeaconsSoundersOverviewEditor from './admin/Produts/BeaconsSoundersOverviewEditor';
import BeaconsSoundersAppsEditor from './admin/Produts/BeaconsSoundersAppsEditor';
import BeaconsSoundersCapabilitiesEditor from './admin/Produts/BeaconsSoundersCapabilitiesEditor';
import AnalyzerSystems from './pages/AnalyzerSystems';
import AnalyzerSystemsBannerEditor from './admin/Systems&Solutions/AnalyzerSystemsBannerEditor';
import AnalyzerSystemsOverviewEditor from './admin/Systems&Solutions/AnalyzerSystemsOverviewEditor';
import AnalyzerSystemsAppsEditor from './admin/Systems&Solutions/AnalyzerSystemsAppsEditor';
import AnalyzerSystemsCapabilitiesEditor from './admin/Systems&Solutions/AnalyzerSystemsCapabilitiesEditor';
import SamplingSystemsBannerEditor from './admin/Systems&Solutions/SamplingSystemsBannerEditor';
import SamplingSystems from './pages/SamplingSystems';
import SamplingSystemsOverviewEditor from './admin/Systems&Solutions/SamplingSystemsOverviewEditor';
import SamplingSystemsAppsEditor from './admin/Systems&Solutions/SamplingSystemsAppsEditor';
import SamplingSystemsCapabilitiesEditor from './admin/Systems&Solutions/SamplingSystemsCapabilitiesEditor';
import IndustrialAutomation from './pages/IndustrialAutomation';
import IndustrialAutomationBannerEditor from './admin/Systems&Solutions/IndustrialAutomationBannerEditor';
import IndustrialAutomationOverviewEditor from './admin/Systems&Solutions/IndustrialAutomationOverviewEditor';
import IndustrialAutomationAppsEditor from './admin/Systems&Solutions/IndustrialAutomationAppsEditor';
import IndAutoCapEditor from './admin/Systems&Solutions/IndAutoCapEditor';
import FireGas from './pages/FireGas';
import FireGasBannerEditor from './admin/Systems&Solutions/FireGasBannerEditor';
import FireGasOverviewEditor from './admin/Systems&Solutions/FireGasOverviewEditor';
import FireGasAppsEditor from './admin/Systems&Solutions/FireGasAppsEditor';
import FireGasCapEditor from './admin/Systems&Solutions/FireGasCapEditor';
import MassNotification from './pages/MassNotification';
import MassNotificationBannerEditor from './admin/Systems&Solutions/MassNotificationBannerEditor';
import MassNotificationOverviewEditor from './admin/Systems&Solutions/MassNotificationOverviewEditor';
import MassNotificationAppsEditor from './admin/Systems&Solutions/MassNotificationAppsEditor';
import MassNotifCapEditor from './admin/Systems&Solutions/MassNotifCapEditor';
import PowerBackup from './pages/PowerBackup';
import PowerBackupBannerEditor from './admin/Systems&Solutions/PowerBackupBannerEditor';
import PowerBackupOverviewEditor from './admin/Systems&Solutions/PowerBackupOverviewEditor';
import PowerBackupAppsEditor from './admin/Systems&Solutions/PowerBackupAppsEditor';
import PowerBackupCapEditor from './admin/Systems&Solutions/PowerBackupCapEditor';
import EmissionMonitoring from './pages/EmissionMonitoring';
import EmissionMonitoringBannerEditor from './admin/Systems&Solutions/EmissionMonitoringBannerEditor';
import EmissionMonitoringOverviewEditor from './admin/Systems&Solutions/EmissionMonitoringOverviewEditor';
import EmissionMonitoringAppsEditor from './admin/Systems&Solutions/EmissionMonitoringAppsEditor';
import EmissionMonCapEditor from './admin/Systems&Solutions/EmissionMonCapEditor';
import SystemsSolutions from './pages/SystemsSolutions';
import AdminSystemsHeaderEditor from './admin/Systems&Solutions/AdminSystemsHeaderEditor';
import AdminSystemsOverviewEditor from './admin/Systems&Solutions/AdminSystemsOverviewEditor';
import AdminSystemsSolutionsGridEditor from './admin/Systems&Solutions/AdminSystemsSolutionsGridEditor';
import ProjectsServices from './pages/ProjectsServices';
import AdminProjectsServicesHeaderEditor from './admin/Projects&Services/ProjectsServicesHeaderBanner';
import AdminProjectsServicesOverviewEditor from './admin/Projects&Services/AdminProjectsServicesOverviewEditor';
import AdminProjectsServicesGridEditor from './admin/Projects&Services/AdminProjectsServicesGridEditor';
import Capabilities from './pages/Capabilities';
import AdminCapabilitiesHeaderEditor from './admin/Projects&Services/AdminCapabilitiesHeaderEditor';
import AdminCapabilitiesOverviewEditor from './admin/Projects&Services/AdminCapabilitiesOverviewEditor';
import AdminExecutionScopeEditor from './admin/Projects&Services/AdminExecutionScopeEditor';
import AdminCapabilitiesWhyUsEditor from './admin/Projects&Services/AdminCapabilitiesWhyUsEditor';
import AfterSalesService from './pages/AfterSalesService';
import AdminAfterSalesHeaderEditor from './admin/Projects&Services/AdminAfterSalesHeaderEditor';
import AdminAfterSalesOverviewEditor from './admin/Projects&Services/AdminAfterSalesOverviewEditor';
import AdminAfterSalesServiceScopeEditor from './admin/Projects&Services/AdminAfterSalesServiceScopeEditor';
import AdminAfterSalesWhyUsEditor from './admin/Projects&Services/AdminAfterSalesWhyUsEditor';

// How long the preloader stays on screen after each page change
// How long the preloader stays on screen after each page change
const PRELOADER_DURATION_MS = 800;
const ADMIN_PATH_PREFIX = '/admin';

// Shows the preloader on first load and on every public page navigation (skips admin)
const RoutePreloader = () => {
  const location = useLocation();
  const [show, setShow] = useState(true);
  const isAdminRoute = location.pathname.startsWith(ADMIN_PATH_PREFIX);

  useLayoutEffect(() => {
    if (isAdminRoute) {
      setShow(false);
      return;
    }

    setShow(true);
    const timer = setTimeout(() => setShow(false), PRELOADER_DURATION_MS);
    return () => clearTimeout(timer);
  }, [location.pathname, isAdminRoute]);

  if (isAdminRoute) return null;

  return show ? <Preloader /> : null;
};

// Helper component to conditionally render floating widgets on non-admin routes
const PublicFloatingWidgets = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null;

  return (
    <>
      {/* <WhatsAppButton /> */}
      <ScrollToTopButton />
    </>
  );
};

function App() {
  return (
    <Router>
      <RoutePreloader />
      <ScrollToTop />
      <PublicFloatingWidgets />
      <Routes>
        {/* Public Site Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/products" element={<Products />} />
        <Route path="/partners" element={<OurPartners />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/agcinstruments" element={<AgcInstruments />} />
        <Route path="/akayIndustries" element={<AkayIndustries />} />
        <Route path="/avevapage" element={<Avevapage />} />
        <Route path="/bartecpage" element={<Bartec />} />
        <Route path="/eaton" element={<Eaton />} />
        <Route path="/ecophysics" element={<EcoPhysics />} />
        <Route path="/emerson" element={<Emerson />} />
        <Route path="/hach" element={<Hach />} />
        <Route path="/hitachi" element={<Hitachi />} />
        <Route path="/hyosung" element={<Hyosung />} />
        <Route path="/moisture" element={<Moisture />} />
        <Route path="/honeywell" element={<Honeywell />} />
        <Route path="/honeywellgas-detection" element={<HoneywellGasDetection />} />
        <Route path="/metal-samples" element={<Metal />} />
        <Route path="/michell-instruments" element={<MichellInstruments />} />
        <Route path="/panorama" element={<Panorama />} />
        <Route path="/prominent" element={<Prominent />} />
        <Route path="/rasilver" element={<Rasilver />} />
        <Route path="/testo" element={<Testo />} />
        <Route path="/tsi" element={<TSI />} />
        <Route path="/vogelsangg" element={<Vogelsangg />} />
        <Route path="/flamegas" element={<FlameGas />} />
        <Route path="/vesda" element={<VESDA />} />
        <Route path="/processanalyzers" element={<ProcessAnalyzera />} />
        <Route path="/processinstrumentation" element={<ProcessInstrumentation />} />
        <Route path="/upstream" element={<Upstream />} />
        <Route path="/beaconssounders" element={<BeaconsSounders />} />
        <Route path="/analyzer/systems" element={<AnalyzerSystems />} />
        <Route path="/sampling/systems" element={<SamplingSystems />} />
        <Route path="/industrial/automation" element={<IndustrialAutomation />} />
        <Route path="/fire/gas" element={<FireGas />} />
        <Route path="/mass/notification" element={<MassNotification />} />
        <Route path="/power/backup" element={<PowerBackup />} />
        <Route path="/emission/monitoring" element={<EmissionMonitoring />} />
        <Route path="/integrated-systems" element={<SystemsSolutions />} />
        <Route path="/projects-services" element={<ProjectsServices />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/afterSales-Service" element={<AfterSalesService />} />

        {/* Admin Authentication Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/reg" element={<AdminRegister />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />

        {/* Protected Admin Nested Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="navbar" element={<AdminNavbar />} />
          <Route path="footer" element={<AdminFooterEditor />} />

          {/* Home Page Editors */}
          <Route path="hero" element={<AdminHeroEditor />} />
          <Route path="about" element={<AdminAboutEditor />} />
          <Route path="mission-vision" element={<AdminMissionVisionEditor />} />
          <Route path="products" element={<AdminProductsEditor />} />
          <Route path="solution" element={<AdminSolutionsEditor />} />
          <Route path="partners" element={<AdminPartnersEditor />} />

          {/* About Page Editors */}
          <Route path="about/section" element={<AdminAboutHeaderEditor />} />
          <Route path="about/story" element={<AdminStoryEditor />} />
          <Route path="specialized/Divisions" element={<AdminSpecializedDivisionsEditor />} />

          {/* Product Page Editors */}
          <Route path="products/hero" element={<AdminProductsHeroEditor />} />
          <Route path="products/overview" element={<AdminProductsOverviewEditor />} />
          <Route path="products/categories" element={<AdminProductCategoriesEditor />} />
          <Route path="products/moisture-banner" element={<AdminMichellBannerEditor />} />
          <Route path="products/moisture-overview" element={<AdminMichellOverviewEditor />} />
          <Route path="products/moisture-details" element={<AdminMichellDetailsEditor />} />
          <Route path="products/moisture-capbilities" element={<MichellCapabilitiesEditor />} />
          <Route path="products/moisture-cta" element={<MichellCTAEditor />} />
          <Route path="products/flamegas-banner" element={<FlameGasBannerEditor />} />
          <Route path="products/flamegas-overview" element={<FlameGasOverviewEditor />} />
          <Route path="products/flamegas-application" element={<FlameGasApplicationsEditor />} />
          <Route path="products/flamegas-capbilities" element={<FlameGasCapabilitiesEditor />} />
          <Route path="products/vesda-banner" element={<VESDABannerEditor />} />
          <Route path="products/vesda-overview" element={<VESDAOverviewEditor />} />
          <Route path="products/vesda-application" element={<VESDAApplicationsEditor />} />
          <Route path="products/vesda-capbilities" element={<VESDACapabilitiesEditor />} />
          <Route path="products/process-banner" element={<ProcessAnalyzersBannerEditor />} />
          <Route path="products/process-overview" element={<ProcessAnalyzersOverviewEditor />} />
          <Route path="products/process-application" element={<ProcessAnalyzersApplicationsEditor />} />
          <Route path="products/process-capbilities" element={<ProcessAnalyzersCapabilitiesEditor />} />
          <Route path="products/processinst-banner" element={<ProcessInstrumentationBannerEditor />} />
          <Route path="products/processinst-overview" element={<ProcessInstrumentationOverviewEditor />} />
          <Route path="products/processinst-application" element={<ProcessInstrumentationAppsEditor />} />
          <Route path="products/processinst-capbilities" element={<ProcessInstrumentationCapabilitiesEditor />} />
          <Route path="products/upstream-banner" element={<UpstreamBannerEditor />} />
          <Route path="products/upstream-overview" element={<UpstreamOverviewEditor />} />
          <Route path="products/upstream-application" element={<UpstreamAppsEditor />} />
          <Route path="products/upstream-capbilities" element={<UpstreamCapabilitiesEditor />} />
          <Route path="products/beacons-banner" element={<BeaconsSoundersBannerEditor />} />
          <Route path="products/beacons-overview" element={<BeaconsSoundersOverviewEditor />} />
          <Route path="products/beacons-application" element={<BeaconsSoundersAppsEditor />} />
          <Route path="products/beacons-capbilities" element={<BeaconsSoundersCapabilitiesEditor />} />


          {/* Partners Page Editors */}
          <Route path="partners/hero" element={<AdminPartnersHeroEditor />} />
          <Route path="partners/overview" element={<AdminPartnersOverviewEditor />} />
          <Route path="partners/categorizedpartners" element={<AdminCategorizedPartnersEditor />} />
          <Route path="partners/cta" element={<AdminPartnerCtaEditor />} />
          <Route path="partners/agc-banner" element={<AdminAGCBannerEditor />} />
          <Route path="partners/agc-overview" element={<AdminAGCOverviewEditor />} />
          <Route path="partners/agc-solutions" element={<AdminAGCSolutionsSupportEditor />} />
          <Route path="partners/akay-Industries" element={<AdminAKAYBannerEditor />} />
          <Route path="partners/akay-overview" element={<AdminAKAYOverviewEditor />} />
          <Route path="partners/akay-details" element={<AdminAkayDetailsEditor />} />
          <Route path="partners/aveva-banner" element={<AdminAvevaBannerEditor />} />
          <Route path="partners/aveva-overview" element={<AdminAvevaOverviewEditor />} />
          <Route path="partners/aveva-details" element={<AdminAvevaDetailsEditor />} />
          <Route path="partners/bartec-banner" element={<AdminBartecBannerEditor />} />
          <Route path="partners/bartec-overview" element={<AdminBartecOverviewEditor />} />
          <Route path="partners/bartec-details" element={<AdminBartecDetailsEditor />} />
          <Route path="partners/eaton-banner" element={<AdminEatonMedcBannerEditor />} />
          <Route path="partners/eaton-overview" element={<AdminEatonMedcOverviewEditor />} />
          <Route path="partners/eaton-details" element={<AdminEatonMedcDetailsEditor />} />
          <Route path="partners/ecophysics-banner" element={<AdminEcoPhysicsBannerEditor />} />
          <Route path="partners/ecophysics-overview" element={<EcoPhysicsOverviewAdminEditor />} />
          <Route path="partners/ecophysics-precision" element={<EcoPhysicsPrecisionAdminEditor />} />
          <Route path="partners/ecophysics-rangesupport" element={<EcoPhysicsRangeSupportAdminEditor />} />
          <Route path="partners/emerson-banner" element={<EmersonBannerAdminEditor />} />
          <Route path="partners/emerson-overview" element={<AdminEmersonOverviewEditor />} />
          <Route path="partners/emerson-details" element={<AdminEmersonDetailsEditor />} />
          <Route path="partners/hach-banner" element={<AdminHachBannerEditor />} />
          <Route path="partners/hach-overview" element={<AdminHachOverviewEditor />} />
          <Route path="partners/hach-details" element={<AdminHachDetailsEditor />} />
          <Route path="partners/hitachi-banner" element={<AdminHitachiBannerEditor />} />
          <Route path="partners/hitachi-overview" element={<AdminHitachiOverviewEditor />} />
          <Route path="partners/hitachi-details" element={<AdminHitachiDetailsEditor />} />
          <Route path="partners/hyosung-banner" element={<AdminHyosungBannerEditor />} />
          <Route path="partners/hyosung-overview" element={<AdminHyosungOverviewEditor />} />
          <Route path="partners/hyosung-details" element={<AdminHyosungDetailsEditor />} />
          <Route path="partners/honeywell-banner" element={<AdminHoneywellBannerEditor />} />
          <Route path="partners/honeywell-overview" element={<AdminHoneywellOverviewEditor />} />
          <Route path="partners/honeywell-details" element={<AdminHoneywellDetailsEditor />} />
          <Route path="partners/honeywellgasdetection-banner" element={<AdminHoneywellGasDetectionBannerEditor />} />
          <Route path="partners/honeywellgasdetection-overview" element={<AdminHoneywellGasDetectionOverviewEditor />} />
          <Route path="partners/honeywellgasdetection-details" element={<AdminHoneywellGasDetectionDetailsEditor />} />
          <Route path="partners/honeywellgasdetection-industries" element={<AdminHoneywellGasDetectionIndustriesEditor />} />
          <Route path="partners/metal-banner" element={<MetalSamplesBannerEditor />} />
          <Route path="partners/metal-overview" element={<MetalSamplesOverviewEditor />} />
          <Route path="partners/metal-details" element={<MetalSamplesDetailsEditor />} />
          <Route path="partners/michell-banner" element={<MichellBannerEditor />} />
          <Route path="partners/michell-overview" element={<MichellOverviewEditor />} />
          <Route path="partners/michell-details" element={<MichellDetailsEditor />} />
          <Route path="partners/panorama-banner" element={<PanoramaBannerEditor />} />
          <Route path="partners/panorama-overview" element={<PanoramaOverviewEditor />} />
          <Route path="partners/panorama-details" element={<PanoramaDetailsEditor />} />
          <Route path="partners/prominent-banner" element={<ProminentBannerEditor />} />
          <Route path="partners/prominent-overview" element={<ProminentOverviewEditor />} />
          <Route path="partners/prominent-details" element={<ProminentDetailsEditor />} />
          <Route path="partners/rasilver-banner" element={<RASilverBannerEditor />} />
          <Route path="partners/rasilver-overview" element={<RASilverOverviewEditor />} />
          <Route path="partners/rasilver-details" element={<RASilverDetailsEditor />} />
          <Route path="partners/testo-banner" element={<TestoBannerEditor />} />
          <Route path="partners/testo-overview" element={<TestoOverviewEditor />} />
          <Route path="partners/testo-details" element={<TestoDetailsEditor />} />
          <Route path="partners/tsi-banner" element={<TSIBannerEditor />} />
          <Route path="partners/tsi-overview" element={<TSIOverviewEditor />} />
          <Route path="partners/tsi-details" element={<TSIDetailsEditor />} />
          <Route path="partners/vogelsang-banner" element={<VogelsangBannerEditor />} />
          <Route path="partners/vogelsang-overview" element={<VogelsangOverviewEditor />} />
          <Route path="partners/vogelsang-details" element={<VogelsangDetailsEditor />} />

          {/* System & solutions Page Editors */}
          <Route path="system/analyzer/system-banner" element={<AnalyzerSystemsBannerEditor />} />
          <Route path="system/analyzer/system-overview" element={<AnalyzerSystemsOverviewEditor />} />
          <Route path="system/analyzer/system-application" element={<AnalyzerSystemsAppsEditor />} />
          <Route path="system/analyzer/system-capbilities" element={<AnalyzerSystemsCapabilitiesEditor />} />
          <Route path="system/samplingy/system-banner" element={<SamplingSystemsBannerEditor />} />
          <Route path="system/samplingy/system-overview" element={<SamplingSystemsOverviewEditor />} />
          <Route path="system/samplingy/system-application" element={<SamplingSystemsAppsEditor />} />
          <Route path="system/samplingy/system-capbilities" element={<SamplingSystemsCapabilitiesEditor />} />

          <Route path="system/industrial/automation-banner" element={<IndustrialAutomationBannerEditor />} />
          <Route path="system/industrial/automation-overview" element={<IndustrialAutomationOverviewEditor />} />

          <Route path="system/industrial/automation-application" element={<IndustrialAutomationAppsEditor />} />
          <Route path="system/industrial/automation-capbilities" element={<IndAutoCapEditor />} />

          <Route path="system/firegas/Control-banner" element={<FireGasBannerEditor />} />
          <Route path="system/firegas/Control-overview" element={<FireGasOverviewEditor />} />
          <Route path="system/firegas/Control-application" element={<FireGasAppsEditor />} />
          <Route path="system/firegas/Control-capbilities" element={<FireGasCapEditor />} />

          <Route path="system/mass/notification-banner" element={<MassNotificationBannerEditor />} />
          <Route path="system/mass/notification-overview" element={<MassNotificationOverviewEditor />} />
          <Route path="system/mass/notification-application" element={<MassNotificationAppsEditor />} />
          <Route path="system/mass/notification-capbilities" element={<MassNotifCapEditor />} />



          <Route path="system/power/backup-banner" element={<PowerBackupBannerEditor />} />
          <Route path="system/power/backup-overview" element={<PowerBackupOverviewEditor />} />
          <Route path="system/power/backup-application" element={<PowerBackupAppsEditor />} />
          <Route path="system/power/backup-capbilities" element={<PowerBackupCapEditor />} />


          <Route path="system/emission/monitoring-banner" element={<EmissionMonitoringBannerEditor />} />
          <Route path="system/emission/monitoring-overview" element={<EmissionMonitoringOverviewEditor />} />
          <Route path="system/emission/monitoring-application" element={<EmissionMonitoringAppsEditor />} />
          <Route path="system/emission/monitoring-capbilities" element={<EmissionMonCapEditor />} />

          <Route path="system/solutions-banner" element={<AdminSystemsHeaderEditor />} />
          <Route path="system/solutions-overview" element={<AdminSystemsOverviewEditor />} />
          <Route path="system/solutions-grid" element={<AdminSystemsSolutionsGridEditor />} />

          <Route path="project/services-banner" element={<AdminProjectsServicesHeaderEditor />} />
          <Route path="project/services-overview" element={<AdminProjectsServicesOverviewEditor />} />
          <Route path="project/services-grid" element={<AdminProjectsServicesGridEditor />} />

          <Route path="project/capabilities-banner" element={<AdminCapabilitiesHeaderEditor />} />
          <Route path="project/capabilities-overview" element={<AdminCapabilitiesOverviewEditor />} />
          <Route path="project/capabilities-execution" element={<AdminExecutionScopeEditor />} />
          <Route path="project/capabilities-whysaudi" element={<AdminCapabilitiesWhyUsEditor />} />


          <Route path="project/aftersales-banner" element={<AdminAfterSalesHeaderEditor />} />
          <Route path="project/aftersales-overview" element={<AdminAfterSalesOverviewEditor />} />
          <Route path="project/aftersales-servicescope" element={<AdminAfterSalesServiceScopeEditor />} />
          <Route path="project/aftersales-whyus" element={<AdminAfterSalesWhyUsEditor />} />


          {/* Contact Page Editors */}
          <Route path="contact/hero" element={<AdminContactHeroEditor />} />
          <Route path="contact/section" element={<AdminContactOverviewEditor />} />
          <Route path="contact/maps" element={<AdminContactMapsEditor />} />
        </Route>

        {/* Fallback - Redirect unknown routes back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;