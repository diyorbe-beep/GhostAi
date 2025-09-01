// Backend configuration
export const BACKEND_URL = 'https://gemini-backen.onrender.com'

// CORS proxies for development (remove these in production)
export const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://thingproxy.freeboard.io/fetch/',
  'https://cors.bridged.cc/'
]

// API endpoints - start with direct connection, fallback to proxies
export const API_ENDPOINTS = {
  CHAT: `${BACKEND_URL}/api/chat`,
  TEST_GEMINI: `${BACKEND_URL}/api/test-gemini`
}

// Alternative CORS proxies if the first one doesn't work
export const ALTERNATIVE_CORS_PROXIES = CORS_PROXIES
