import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chartType: 'bar',
  chartData: null,
  chartOptions: null,
  xAxis: null,
  yAxis: null,
  zAxis: null,
  filters: {},
  loading: false,
  error: null,
  savedCharts: [],
  currentChart: null,
};

const chartSlice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    setChartType: (state, action) => {
      state.chartType = action.payload;
    },
    setXAxis: (state, action) => {
      state.xAxis = action.payload;
    },
    setYAxis: (state, action) => {
      state.yAxis = action.payload;
    },
    setZAxis: (state, action) => {
      state.zAxis = action.payload;
    },
    setFilter: (state, action) => {
      const { field, value } = action.payload;
      if (value === '') {
        delete state.filters[field];
      } else {
        state.filters[field] = value;
      }
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    generateChartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    generateChartSuccess: (state, action) => {
      state.loading = false;
      state.chartData = action.payload.data;
      state.chartOptions = action.payload.options;
      state.error = null;
    },
    generateChartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    saveChartStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    saveChartSuccess: (state, action) => {
      state.loading = false;
      state.savedCharts.unshift(action.payload);
      state.currentChart = action.payload;
      state.error = null;
    },
    saveChartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchChartsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChartsSuccess: (state, action) => {
      state.loading = false;
      state.savedCharts = action.payload;
      state.error = null;
    },
    fetchChartsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentChart: (state, action) => {
      state.currentChart = action.payload;
      if (action.payload) {
        state.chartType = action.payload.chartType;
        state.chartData = action.payload.chartData;
        state.chartOptions = action.payload.chartOptions;
        state.xAxis = action.payload.xAxis;
        state.yAxis = action.payload.yAxis;
        state.zAxis = action.payload.zAxis;
        state.filters = action.payload.filters || {};
      }
    },
    resetChart: (state) => {
      state.chartType = 'bar';
      state.chartData = null;
      state.chartOptions = null;
      state.xAxis = null;
      state.yAxis = null;
      state.zAxis = null;
      state.filters = {};
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setChartType,
  setXAxis,
  setYAxis,
  setZAxis,
  setFilter,
  clearFilters,
  generateChartStart,
  generateChartSuccess,
  generateChartFailure,
  saveChartStart,
  saveChartSuccess,
  saveChartFailure,
  fetchChartsStart,
  fetchChartsSuccess,
  fetchChartsFailure,
  setCurrentChart,
  resetChart,
  clearError,
} = chartSlice.actions;

export default chartSlice.reducer;
