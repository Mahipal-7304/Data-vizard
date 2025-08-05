import API from './api';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await API.post('/auth/register', {
        username: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'user'
      });
      
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default header for future requests
      API.defaults.headers.common['x-auth-token'] = token;
      
      // Get user data
      const userResponse = await this.getCurrentUser();
      
      return {
        success: true,
        token,
        user: userResponse.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Registration failed';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await API.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      const { token } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default header for future requests
      API.defaults.headers.common['x-auth-token'] = token;
      
      // Get user data
      const userResponse = await this.getCurrentUser();
      
      return {
        success: true,
        token,
        user: userResponse.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Login failed';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await API.get('/auth/user');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to get user data';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['x-auth-token'];
    return { success: true };
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }
}

const authService = new AuthService();
export default authService;
