import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async ({ username, email, password }) => {
  try {
    console.log('Making API request to:', `${API_BASE_URL}/users/registerUser`);
    const response = await axios.post(`${API_BASE_URL}/users/registerUser`, {
      username,
      email,
      password,
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (err) {
    console.error('API Error:', {
      response: err.response?.data,
      status: err.response?.status,
      error: err
    });
    // Normalize error message coming from backend
    const message =
      err?.response?.data?.error || err?.response?.data?.message || err.message || 'Registration failed';
    throw new Error(message);
  }
};

export const loginUser = async ({ username, password }) => {
  try {
    console.log('Making API request to:', `${API_BASE_URL}/users/registerUser`);
    const response = await axios.post(`${API_BASE_URL}/users/loginUser`, {
      username,
      password,
    });
    console.log('API Response:', response.data);
    return response.data;
  } catch (err) {
    console.error('API Error:', {
      response: err.response?.data,
      status: err.response?.status,
      error: err
    });
    // Normalize error message coming from backend
    const message =
      err?.response?.data?.error || err?.response?.data?.message || err.message || 'Login failed';
    throw new Error(message);
  }
};
