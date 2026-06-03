import React from 'react';
import Dashboard from '../pages/dashboard/Dashboard';
import VesselList from '../pages/vessels/VesselList';
import AddVessel from '../pages/vessels/AddVessel';
import VoyageList from '../pages/voyages/VoyageList';
import CreateVoyage from '../pages/voyages/CreateVoyage';
import VoyageDetails from '../pages/voyages/VoyageDetails';
import NoonReports from '../pages/reports/NoonReports';
import SpeedAnalysis from '../pages/performance/SpeedAnalysis';
import FuelAnalysis from '../pages/performance/FuelAnalysis';
import ClaimsAnalysis from '../pages/performance/ClaimsAnalysis';
import WeatherForecast from '../pages/weather/WeatherForecast';
import RoutePlanner from '../pages/optimization/RoutePlanner';
import VesselPerformanceReport from '../pages/analytics/VesselPerformanceReport';
import CompanyProfile from '../pages/settings/CompanyProfile';

export const TABS = {
  DASHBOARD: 'dashboard',
  VESSELS_LIST: 'vessels-list',
  VESSELS_ADD: 'vessels-add',
  VOYAGES_LIST: 'voyages-list',
  VOYAGES_CREATE: 'voyages-create',
  VOYAGE_DETAILS: 'voyage-details',
  REPORTS_UPLOAD: 'reports-upload',
  PERF_SPEED: 'perf-speed',
  PERF_FUEL: 'perf-fuel',
  PERF_CLAIMS: 'perf-claims',
  WEATHER: 'weather',
  OPTIMIZATION: 'optimization',
  ANALYTICS: 'analytics',
  SETTINGS: 'settings'
};

export function renderTab(tabKey, props) {
  const { setCurrentTab, onSelectVessel, selectedVoyageId, setSelectedVoyageId } = props;

  switch (tabKey) {
    case TABS.DASHBOARD:
      return <Dashboard setCurrentTab={setCurrentTab} onSelectVessel={onSelectVessel} />;
    case TABS.VESSELS_LIST:
      return <VesselList setCurrentTab={setCurrentTab} onSelectVessel={onSelectVessel} />;
    case TABS.VESSELS_ADD:
      return <AddVessel setCurrentTab={setCurrentTab} />;
    case TABS.VOYAGES_LIST:
      return <VoyageList setCurrentTab={setCurrentTab} setSelectedVoyageId={setSelectedVoyageId} />;
    case TABS.VOYAGES_CREATE:
      return <CreateVoyage setCurrentTab={setCurrentTab} />;
    case TABS.VOYAGE_DETAILS:
      return <VoyageDetails voyageId={selectedVoyageId} setCurrentTab={setCurrentTab} />;
    case TABS.REPORTS_UPLOAD:
      return <NoonReports />;
    case TABS.PERF_SPEED:
      return <SpeedAnalysis />;
    case TABS.PERF_FUEL:
      return <FuelAnalysis />;
    case TABS.PERF_CLAIMS:
      return <ClaimsAnalysis />;
    case TABS.WEATHER:
      return <WeatherForecast />;
    case TABS.OPTIMIZATION:
      return <RoutePlanner />;
    case TABS.ANALYTICS:
      return <VesselPerformanceReport />;
    case TABS.SETTINGS:
      return <CompanyProfile />;
    default:
      return <Dashboard setCurrentTab={setCurrentTab} onSelectVessel={onSelectVessel} />;
  }
}
