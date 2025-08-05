import { apiSlice } from '../../app/api/apiSlice';

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
          // Don't set content-type, let the browser set it with the correct boundary
          headers: {},
          // Track upload progress
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // This will be handled by the RTK Query middleware
          },
        };
      },
      invalidatesTags: ['File'],
    }),
    getFiles: builder.query({
      query: () => '/upload/files',
      providesTags: (result = [], error, arg) => [
        'File',
        ...result.map(({ id }) => ({ type: 'File', id })),
      ],
    }),
    getFileById: builder.query({
      query: (fileId) => `/upload/files/${fileId}`,
      providesTags: (result, error, id) => [{ type: 'File', id }],
    }),
    deleteFile: builder.mutation({
      query: (fileId) => ({
        url: `/upload/files/${fileId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetFilesQuery,
  useGetFileByIdQuery,
  useDeleteFileMutation,
} = uploadApi;
