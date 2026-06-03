import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchVoyages, registerNewVoyage, fetchVoyageById } from '../services/voyageApi';
import { 
  postCospReport, 
  postNoonReport, 
  postEospReport,
  postArrivalReport,
  fetchArrivalReports,
  postDepartureReport,
  fetchDepartureReports,
  postPortNoonReport,
  fetchPortNoonReports
} from '../services/reportApi';
import { fetchAlerts, updateAlertStatus } from '../services/alertApi';
import { processVoyagePerformance } from '../utils/performanceCalculations';

const VoyageContext = createContext(null);

export const VoyageProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [voyages, setVoyages] = useState([]);
  const [noonReports, setNoonReports] = useState({});
  const [cospReports, setCospReports] = useState({});
  const [eospReports, setEospReports] = useState({});
  const [arrivalReports, setArrivalReports] = useState({});
  const [departureReports, setDepartureReports] = useState({});
  const [portNoonReports, setPortNoonReports] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all voyages and alerts from backend on mount
  const refreshData = async () => {
    try {
      const allVoyages = await fetchVoyages();
      setVoyages(allVoyages || []);

      const allAlerts = await fetchAlerts();
      setAlerts(allAlerts || []);

      // Pre-populate reports dictionary for each voyage
      const noonDict = {};
      const cospDict = {};
      const eospDict = {};
      const arrivalDict = {};
      const departureDict = {};
      const portNoonDict = {};

      for (const voyage of allVoyages) {
        try {
          const detail = await fetchVoyageById(voyage.id);
          noonDict[voyage.id] = detail.noonReports || [];
          if (detail.cospReport) cospDict[voyage.id] = detail.cospReport;
          if (detail.eospReport) eospDict[voyage.id] = detail.eospReport;

          // Fetch new reports
          const arrivals = await fetchArrivalReports(voyage.id);
          if (arrivals && arrivals.length > 0) arrivalDict[voyage.id] = arrivals[0];

          const departures = await fetchDepartureReports(voyage.id);
          if (departures && departures.length > 0) departureDict[voyage.id] = departures[0];

          const portNoons = await fetchPortNoonReports(voyage.id);
          portNoonDict[voyage.id] = portNoons || [];
        } catch (err) {
          console.error(`Failed to fetch details for voyage ${voyage.id}:`, err);
        }
      }

      setNoonReports(noonDict);
      setCospReports(cospDict);
      setEospReports(eospDict);
      setArrivalReports(arrivalDict);
      setDepartureReports(departureDict);
      setPortNoonReports(portNoonDict);
    } catch (error) {
      console.error('Error refreshing voyage/alerts data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    } else {
      setVoyages([]);
      setNoonReports({});
      setCospReports({});
      setEospReports({});
      setArrivalReports({});
      setDepartureReports({});
      setPortNoonReports({});
      setAlerts([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const createVoyage = async (voyageData) => {
    try {
      const newVoyage = await registerNewVoyage(voyageData);
      setVoyages(prev => [newVoyage, ...prev]);
      return newVoyage;
    } catch (error) {
      console.error('Failed to create voyage:', error);
      throw error;
    }
  };

  const uploadCOSP = async (voyageId, cospData) => {
    try {
      const report = await postCospReport(voyageId, cospData);
      setCospReports(prev => ({ ...prev, [voyageId]: report }));
      await refreshData();
      return report;
    } catch (error) {
      console.error('Failed to upload COSP report:', error);
      throw error;
    }
  };

  const uploadNoonReport = async (voyageId, reportData) => {
    try {
      const report = await postNoonReport(voyageId, reportData);
      setNoonReports(prev => {
        const currentList = prev[voyageId] || [];
        return { ...prev, [voyageId]: [...currentList, report] };
      });
      await refreshData();
      return report;
    } catch (error) {
      console.error('Failed to upload Noon report:', error);
      throw error;
    }
  };

  const uploadEOSP = async (voyageId, eospData) => {
    try {
      const report = await postEospReport(voyageId, eospData);
      setEospReports(prev => ({ ...prev, [voyageId]: report }));
      await refreshData();
      return report;
    } catch (error) {
      console.error('Failed to upload EOSP report:', error);
      throw error;
    }
  };

  const uploadArrivalReport = async (voyageId, reportData) => {
    try {
      const report = await postArrivalReport({ ...reportData, voyageId });
      setArrivalReports(prev => ({ ...prev, [voyageId]: report }));
      await refreshData();
      return report;
    } catch (error) {
      console.error('Failed to upload Arrival report:', error);
      throw error;
    }
  };

  const uploadDepartureReport = async (voyageId, reportData) => {
    try {
      const report = await postDepartureReport({ ...reportData, voyageId });
      setDepartureReports(prev => ({ ...prev, [voyageId]: report }));
      await refreshData();
      return report;
    } catch (error) {
      console.error('Failed to upload Departure report:', error);
      throw error;
    }
  };

  const uploadPortNoonReport = async (voyageId, reportData) => {
    try {
      const report = await postPortNoonReport({ ...reportData, voyageId });
      setPortNoonReports(prev => {
        const currentList = prev[voyageId] || [];
        return { ...prev, [voyageId]: [...currentList, report] };
      });
      await refreshData();
      return report;
    } catch (error) {
      console.error('Failed to upload Port Noon report:', error);
      throw error;
    }
  };

  const resolveAlert = async (alertId) => {
    try {
      const updated = await updateAlertStatus(alertId, { status: 'Resolved' });
      setAlerts(prev => prev.map(a => a.id === alertId ? updated : a));
    } catch (error) {
      console.error('Failed to resolve alert:', error);
    }
  };

  const getVoyagePerformanceStats = (voyageId) => {
    const voyage = voyages.find(v => v.id === voyageId);
    const reports = noonReports[voyageId] || [];
    if (!voyage) return null;
    return processVoyagePerformance(reports, voyage.cpSpeed, voyage.cpConsumption, voyage.charterRate, voyage.fuelPrice);
  };

  return (
    <VoyageContext.Provider value={{
      voyages,
      noonReports,
      cospReports,
      eospReports,
      arrivalReports,
      departureReports,
      portNoonReports,
      alerts,
      loading,
      createVoyage,
      uploadCOSP,
      uploadNoonReport,
      uploadEOSP,
      uploadArrivalReport,
      uploadDepartureReport,
      uploadPortNoonReport,
      resolveAlert,
      getVoyagePerformanceStats,
      refreshData
    }}>
      {children}
    </VoyageContext.Provider>
  );
};

export const useVoyages = () => {
  const context = useContext(VoyageContext);
  if (!context) throw new Error('useVoyages must be used inside VoyageProvider');
  return context;
};
