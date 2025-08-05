import API from './api';

class DataService {
  // Upload file
  async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await API.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // You can use this for progress indicators
          console.log(`Upload Progress: ${progress}%`);
        },
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'File upload failed';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get all files for current user
  async getFiles() {
    try {
      const response = await API.get('/upload/files');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch files';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get specific file by ID
  async getFileById(fileId) {
    try {
      const response = await API.get(`/upload/files/${fileId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch file';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Delete file
  async deleteFile(fileId) {
    try {
      const response = await API.delete(`/upload/files/${fileId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete file';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }

  // Get file data for visualization
  async getFileData(fileId) {
    try {
      const response = await API.get(`/upload/files/${fileId}/data`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch file data';
      const err = new Error(errorMessage);
      err.success = false;
      throw err;
    }
  }
}

const dataService = new DataService();
export default dataService;
