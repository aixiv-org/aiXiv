// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  PROFILE_UPDATE: `${API_BASE_URL}/api/profile/update`,
  PROFILE_AVATAR: `${API_BASE_URL}/api/profile/avatar`,
  PROFILE_GET: (userId) => `${API_BASE_URL}/api/profile/${userId}`,
  PROFILE_ME: `${API_BASE_URL}/api/profile/me`,
};

export default API_ENDPOINTS;