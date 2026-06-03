const API_URL = 'http://localhost:5000/api/voyages';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export async function postNoonReport(voyageId, noonData) {
  try {
    const res = await fetch(`${API_URL}/${voyageId}/noon`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(noonData)
    });
    if (!res.ok) throw new Error('Failed to post Noon report');
    return await res.json();
  } catch (error) {
    console.error('Error posting Noon report:', error);
    throw error;
  }
}

export async function postCospReport(voyageId, cospData) {
  try {
    const res = await fetch(`${API_URL}/${voyageId}/cosp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(cospData)
    });
    if (!res.ok) throw new Error('Failed to post COSP report');
    return await res.json();
  } catch (error) {
    console.error('Error posting COSP report:', error);
    throw error;
  }
}

export async function postEospReport(voyageId, eospData) {
  try {
    const res = await fetch(`${API_URL}/${voyageId}/eosp`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eospData)
    });
    if (!res.ok) throw new Error('Failed to post EOSP report');
    return await res.json();
  } catch (error) {
    console.error('Error posting EOSP report:', error);
    throw error;
  }
}

export async function uploadReportFile(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ status: 200, filename: file.name, size: file.size });
    }, 1500);
  });
}

const REPORT_BASE_URL = 'http://localhost:5000/api';

export async function postArrivalReport(arrivalData) {
  try {
    const res = await fetch(`${REPORT_BASE_URL}/arrival-reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(arrivalData)
    });
    if (!res.ok) throw new Error('Failed to post Arrival report');
    return await res.json();
  } catch (error) {
    console.error('Error posting Arrival report:', error);
    throw error;
  }
}

export async function fetchArrivalReports(voyageId) {
  try {
    const url = voyageId ? `${REPORT_BASE_URL}/arrival-reports?voyageId=${voyageId}` : `${REPORT_BASE_URL}/arrival-reports`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch Arrival reports');
    return await res.json();
  } catch (error) {
    console.error('Error fetching Arrival reports:', error);
    throw error;
  }
}

export async function postDepartureReport(departureData) {
  try {
    const res = await fetch(`${REPORT_BASE_URL}/departure-reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(departureData)
    });
    if (!res.ok) throw new Error('Failed to post Departure report');
    return await res.json();
  } catch (error) {
    console.error('Error posting Departure report:', error);
    throw error;
  }
}

export async function fetchDepartureReports(voyageId) {
  try {
    const url = voyageId ? `${REPORT_BASE_URL}/departure-reports?voyageId=${voyageId}` : `${REPORT_BASE_URL}/departure-reports`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch Departure reports');
    return await res.json();
  } catch (error) {
    console.error('Error fetching Departure reports:', error);
    throw error;
  }
}

export async function postPortNoonReport(portNoonData) {
  try {
    const res = await fetch(`${REPORT_BASE_URL}/port-noon-reports`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(portNoonData)
    });
    if (!res.ok) throw new Error('Failed to post Port Noon report');
    return await res.json();
  } catch (error) {
    console.error('Error posting Port Noon report:', error);
    throw error;
  }
}

export async function fetchPortNoonReports(voyageId) {
  try {
    const url = voyageId ? `${REPORT_BASE_URL}/port-noon-reports?voyageId=${voyageId}` : `${REPORT_BASE_URL}/port-noon-reports`;
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch Port Noon reports');
    return await res.json();
  } catch (error) {
    console.error('Error fetching Port Noon reports:', error);
    throw error;
  }
}
