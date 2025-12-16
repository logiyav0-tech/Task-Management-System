import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/auth';

class AuthService {
    login(username, password) {
        return axios.post(`${API_BASE_URL}/login`, { username, password })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    register(userData) {
        return axios.post(`${API_BASE_URL}/register`, userData)
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    getAuthHeader() {
        const user = this.getCurrentUser();
        if (user && user.token) {
            return { Authorization: 'Bearer ' + user.token };
        } else {
            return {};
        }
    }
}

const authService = new AuthService();
export default authService;