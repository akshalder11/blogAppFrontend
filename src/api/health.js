import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const healthCheck = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Backend service is not available');
  }
};