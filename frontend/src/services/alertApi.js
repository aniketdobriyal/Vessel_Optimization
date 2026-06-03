const API_URL = 'http://localhost:5000/api/alerts';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function fetchAlerts() {
  try {
    const res = await fetch(API_URL, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
}

export async function updateAlertStatus(id, alertData) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(alertData)
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return await res.json();
  } catch (error) {
    console.error('Error updating alert status:', error);
    throw error;
  }
}
