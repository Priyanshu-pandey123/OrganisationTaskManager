import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
 // You'll need to create this

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://9q38lq2b-5030.inc1.devtunnels.ms', // Your API base URL
  prepareHeaders: (headers, { getState }) => {
    // Add auth token if available
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: '/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    signup: builder.mutation({
      query: (userData) => ({
        url: '/v1/auth/signup',
        method: 'POST',
        body: userData,
      }),
    }),
   
    verifyEmail: builder.query({
      query: (token) => `/v1/auth/verify/${token}`,
    }),
    
    getTasks: builder.query({
      query: () => '/tasks',
    }),
    
    createTask: builder.mutation({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
    }),
    
    updateTask: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: updates,
      }),
    }),
    
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
    }),
    
    getCompanies: builder.query({
      query: () => '/v1/org/getall',
    }),
    
    createCompany: builder.mutation({
      query: (company) => ({
        url: '/companies',
        method: 'POST',
        body: company,
      }),
    }),
  }),
});
export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyEmailQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetCompaniesQuery,
  useCreateCompanyMutation,
} = apiSlice;
