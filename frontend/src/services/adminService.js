import API from './api';

class AdminService {
  // Get all users with pagination
  async getUsers(page = 1, limit = 10) {
    try {
      const response = await API.get(`/admin/users?page=${page}&limit=${limit}`);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to fetch users';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get login logs with filtering
  async getLoginLogs(page = 1, limit = 20, status = '', email = '') {
    try {
      let url = `/admin/login-logs?page=${page}&limit=${limit}`;
      if (status) url += `&status=${status}`;
      if (email) url += `&email=${email}`;
      
      const response = await API.get(url);
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to fetch login logs';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get active sessions
  async getActiveSessions() {
    try {
      const response = await API.get('/admin/active-sessions');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to fetch active sessions';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get platform statistics
  async getStats() {
    try {
      const response = await API.get('/admin/stats');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to fetch statistics';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Update user role
  async updateUserRole(userId, role) {
    try {
      const response = await API.put(`/admin/users/${userId}/role`, { role });
      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to update user role';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await API.delete(`/admin/users/${userId}`);
      return {
        success: true,
        message: response.data.msg
      };
    } catch (error) {
      const errorMessage = error.response?.data?.msg || 'Failed to delete user';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }
}

const adminService = new AdminService();
export default adminService;
