import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  currentFile: null,
  loading: false,
  error: null,
  uploadProgress: 0,
  uploadComplete: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    uploadStart: (state) => {
      state.loading = true;
      state.uploadProgress = 0;
      state.uploadComplete = false;
      state.error = null;
    },
    uploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    uploadSuccess: (state, action) => {
      state.loading = false;
      state.uploadProgress = 100;
      state.uploadComplete = true;
      state.currentFile = action.payload;
      state.files.unshift(action.payload);
      state.error = null;
    },
    uploadFailure: (state, action) => {
      state.loading = false;
      state.uploadProgress = 0;
      state.uploadComplete = false;
      state.error = action.payload;
    },
    resetUpload: (state) => {
      state.uploadProgress = 0;
      state.uploadComplete = false;
      state.error = null;
    },
    fetchFilesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchFilesSuccess: (state, action) => {
      state.loading = false;
      state.files = action.payload;
      state.error = null;
    },
    fetchFilesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentFile: (state, action) => {
      state.currentFile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  uploadStart,
  uploadProgress,
  uploadSuccess,
  uploadFailure,
  resetUpload,
  fetchFilesStart,
  fetchFilesSuccess,
  fetchFilesFailure,
  setCurrentFile,
  clearError,
} = uploadSlice.actions;

export default uploadSlice.reducer;
