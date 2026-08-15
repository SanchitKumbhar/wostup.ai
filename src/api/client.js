import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

// Automatically attach tokens to each and every API request
apiClient.interceptors.request.use(async (config) => {
  if (window.Clerk && window.Clerk.session) {
    try {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const user = window.Clerk.user;
      if (user && user.primaryEmailAddress) {
        config.headers['x-user-email'] = user.primaryEmailAddress.emailAddress;
      }
    } catch (error) {
      console.error('Error fetching Clerk token in interceptor:', error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
