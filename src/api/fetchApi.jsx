const API_BASE_URL = "http://192.168.18.221:5237/api";

// Helper to get token from cookies
export const getTokenFromCookies = () => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
  if (match) return match[2];
  return null;
};

/**
 * Generic API fetch wrapper
 * @param {string} endpoint - API endpoint starting with "/"
 * @param {string} method - HTTP method: GET, POST, PUT, DELETE
 * @param {Object|null} body - Request body if POST/PUT
 * @returns {Promise<any>} - JSON response
 */
export const fetchAPI = async (endpoint, method = "GET", body = null) => {
  const token = getTokenFromCookies();

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${text}`);
  }

  return await response.json();
};