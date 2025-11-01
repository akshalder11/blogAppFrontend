import api from './client';

export const registerUser = async ({ username, email, password }) => {
  return api.post('/users/registerUser', { username, email, password }, {
    fallbackMessage: 'Registration failed',
  });
};

export const loginUser = async ({ username, password }) => {
  return api.post('/users/loginUser', { username, password }, {
    fallbackMessage: 'Login failed',
  });
};
