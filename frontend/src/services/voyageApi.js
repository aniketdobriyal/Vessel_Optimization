const API_URL = 'http://localhost:5000/api/voyages';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function fetchVoyages() {
  try {
    const res = await fetch(API_URL, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch voyages');
    return await res.json();
  } catch (error) {
    console.error('Error fetching voyages:', error);
    throw error;
  }
}

export async function fetchVoyageById(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch voyage details');
    return await res.json();
  } catch (error) {
    console.error('Error fetching voyage by ID:', error);
    throw error;
  }
}

export async function registerNewVoyage(voyageData) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(voyageData)
    });
    if (!res.ok) throw new Error('Failed to create voyage');
    return await res.json();
  } catch (error) {
    console.error('Error registering new voyage:', error);
    throw error;
  }
}

export async function updateVoyageDetails(id, voyageData) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(voyageData)
    });
    if (!res.ok) throw new Error('Failed to update voyage');
    return await res.json();
  } catch (error) {
    console.error('Error updating voyage details:', error);
    throw error;
  }
}

export async function deleteVoyageRecord(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete voyage');
    return await res.json();
  } catch (error) {
    console.error('Error deleting voyage:', error);
    throw error;
  }
}
