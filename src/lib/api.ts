// Base URL of the FastAPI backend (https://github.com/tylerprogramming/fastapi-backend).
// Set VITE_API_BASE_URL in .env to point at a deployed server or a tunnel.
export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
).replace(/\/+$/, '');
