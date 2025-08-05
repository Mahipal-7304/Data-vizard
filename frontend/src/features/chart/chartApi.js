import { apiSlice } from '../../app/api/apiSlice';

export const chartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateChart: builder.mutation({
      query: (chartData) => ({
        url: '/charts/generate',
        method: 'POST',
        body: chartData,
      }),
    }),
    saveChart: builder.mutation({
      query: (chartData) => ({
        url: '/charts/save',
        method: 'POST',
        body: chartData,
      }),
      invalidatesTags: ['Chart'],
    }),
    getSavedCharts: builder.query({
      query: () => '/charts',
      providesTags: (result = []) => [
        'Chart',
        ...result.map(({ id }) => ({ type: 'Chart', id })),
      ],
    }),
    getChartById: builder.query({
      query: (chartId) => `/charts/${chartId}`,
      providesTags: (result, error, id) => [{ type: 'Chart', id }],
    }),
    updateChart: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/charts/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Chart', id }],
    }),
    deleteChart: builder.mutation({
      query: (chartId) => ({
        url: `/charts/${chartId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Chart'],
    }),
    exportChart: builder.mutation({
      query: ({ chartId, format }) => ({
        url: `/charts/export/${chartId}?format=${format}`,
        method: 'GET',
        responseHandler: async (response) => {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `chart-${chartId}.${format}`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return { success: true };
        },
        cache: 'no-cache',
      }),
    }),
  }),
});

export const {
  useGenerateChartMutation,
  useSaveChartMutation,
  useGetSavedChartsQuery,
  useGetChartByIdQuery,
  useUpdateChartMutation,
  useDeleteChartMutation,
  useExportChartMutation,
} = chartApi;
