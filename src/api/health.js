import api from './client';

export const healthCheck = async () => {
  try {
    return await api.get('/health', { fallbackMessage: 'Backend service is not available' });
  } catch (error) {
    throw new Error('Backend service is not available');
  }
};