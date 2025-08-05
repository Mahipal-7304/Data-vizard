import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Create our baseQuery instance
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('x-auth-token', token);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle 401 Unauthorized
    if (result.error?.status === 401) {
      // You could dispatch a logout action here if needed
      console.error('Authentication error:', result.error);
    }
    
    return result;
  },
  tagTypes: ['File', 'Chart', 'User'],
  endpoints: (builder) => ({}),
});

export default apiSlice;
