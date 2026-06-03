import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchVessels, registerNewVessel, updateVesselDetails } from '../services/vesselApi';

const VesselContext = createContext(null);

export const VesselProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [vessels, setVessels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load vessels from backend when authenticated
  useEffect(() => {
    async function loadVessels() {
      try {
        const data = await fetchVessels();
        setVessels(data || []);
      } catch (error) {
        console.error('Failed to load vessels from backend:', error);
      } finally {
        setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadVessels();
    } else {
      setVessels([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  const addVessel = async (vesselData) => {
    try {
      const newVessel = await registerNewVessel(vesselData);
      setVessels(prev => [newVessel, ...prev]);
      return newVessel;
    } catch (error) {
      console.error('Failed to register new vessel:', error);
      throw error;
    }
  };

  const updateVesselStatus = async (id, status, lat, lon, fuelRob) => {
    try {
      const updated = await updateVesselDetails(id, { status, lat, lon, fuelRob });
      setVessels(prev => prev.map(v => (v.id === id || v.imo === id) ? updated : v));
      return updated;
    } catch (error) {
      console.error('Failed to update vessel status:', error);
    }
  };

  const updateVesselScores = async (id, speed, fuel, weather) => {
    try {
      const updated = await updateVesselDetails(id, { speedScore: speed, fuelScore: fuel, weatherScore: weather });
      setVessels(prev => prev.map(v => (v.id === id || v.imo === id) ? updated : v));
      return updated;
    } catch (error) {
      console.error('Failed to update vessel scores:', error);
    }
  };

  return (
    <VesselContext.Provider value={{ vessels, loading, addVessel, updateVesselStatus, updateVesselScores, setVessels }}>
      {children}
    </VesselContext.Provider>
  );
};

export const useVessels = () => {
  const context = useContext(VesselContext);
  if (!context) throw new Error('useVessels must be used inside VesselProvider');
  return context;
};
