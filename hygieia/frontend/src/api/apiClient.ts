import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerHospital = (data: any) => apiClient.post('/register_hospital', data);
export const loginHospital = (data: any) => apiClient.post('/login_hospital', data);
export const loginCentral = (data: any) => apiClient.post('/login_central', data);

// ML API functions
export const uploadData = (formData: FormData) => apiClient.post('/upload_data', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const trainModel = () => apiClient.post('/train_model');
export const getWeights = () => apiClient.get('/get_weights');

export default apiClient;
