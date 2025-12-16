import axios from 'axios';
import authService from './authService';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

// Create axios instance with auth interceptor
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const user = authService.getCurrentUser();
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            authService.logout();
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

const taskService = {
    getAllTasks: () => apiClient.get(''),
    getTaskById: (id) => apiClient.get(`/${id}`),
    createTask: (task) => apiClient.post('', task),
    updateTask: (id, task) => apiClient.put(`/${id}`, task),
    deleteTask: (id) => apiClient.delete(`/${id}`),
    getTaskSummary: () => apiClient.get('/summary'),
    initializeData: () => apiClient.post('/initialize')
};

export default taskService;