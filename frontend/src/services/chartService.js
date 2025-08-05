import API from './api';

class ChartService {
  // Create new chart
  async createChart(chartData) {
    try {
      const response = await API.post('/charts', chartData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create chart';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get all charts for current user
  async getCharts() {
    try {
      const response = await API.get('/charts');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch charts';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get specific chart by ID
  async getChartById(chartId) {
    try {
      const response = await API.get(`/charts/${chartId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch chart';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Update chart
  async updateChart(chartId, chartData) {
    try {
      const response = await API.put(`/charts/${chartId}`, chartData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update chart';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Delete chart
  async deleteChart(chartId) {
    try {
      const response = await API.delete(`/charts/${chartId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete chart';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get chart statistics
  async getChartStats() {
    try {
      const response = await API.get('/charts/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch chart statistics';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Share chart
  async shareChart(chartId, shareSettings) {
    try {
      const response = await API.post(`/charts/${chartId}/share`, shareSettings);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to share chart';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }
}

const chartService = new ChartService();
export default chartService;
