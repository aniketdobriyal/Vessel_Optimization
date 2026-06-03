const API_URL = 'http://localhost:5000/api/auth';

export async function loginUser(email, password, role) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Login failed');
    }
    return await res.json();
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

export async function registerUser(name, email, password, role, company) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, company })
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || 'Registration failed');
    }
    return await res.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

export async function fetchCurrentUserProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const res = await fetch(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Token verification failed');
    const data = await res.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
}

export async function logoutUser() {
  return { status: 200, message: 'Logged out successfully' };
}
