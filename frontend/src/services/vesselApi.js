const API_URL = 'http://localhost:5000/api/vessels';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function fetchVessels() {
  try {
    const res = await fetch(API_URL, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch vessels');
    return await res.json();
  } catch (error) {
    console.error('Error fetching vessels:', error);
    throw error;
  }
}

export async function registerNewVessel(vesselData) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(vesselData)
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Failed to register vessel');
    }
    return await res.json();
  } catch (error) {
    console.error('Error registering vessel:', error);
    throw error;
  }
}

export async function updateVesselDetails(id, vesselData) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(vesselData)
    });
    if (!res.ok) throw new Error('Failed to update vessel details');
    return await res.json();
  } catch (error) {
    console.error('Error updating vessel details:', error);
    throw error;
  }
}

export async function deleteVesselRecord(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete vessel');
    return await res.json();
  } catch (error) {
    console.error('Error deleting vessel:', error);
    throw error;
  }
}
