// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//  // You'll need to create this

// const baseQuery = fetchBaseQuery({
//   baseUrl: 'https://9q38lq2b-5030.inc1.devtunnels.ms', // Your API base URL
//   prepareHeaders: (headers, { getState }) => {
//     // Add auth token if available
//     const token = (getState() as RootState).auth.token;
//     if (token) {
//       headers.set('authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// export const apiSlice = createApi({
//   baseQuery,
//   endpoints: (builder) => ({

//     login: builder.mutation({
//       query: (credentials) => ({
//         url: '/v1/auth/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
    
//     signup: builder.mutation({
//       query: (userData) => ({
//         url: '/v1/auth/signup',
//         method: 'POST',
//         body: userData,
//       }),
//     }),
   
//     verifyEmail: builder.query({
//       query: (token) => `/v1/auth/verify/${token}`,
//     }),
    
//     getTasks: builder.query({
//       query: (params) => {
//         // Handle both old userId parameter and new filters object
//         if (typeof params === 'string' || typeof params === 'number') {
//           // Backward compatibility for userId only
//           return `/v1/task?user_id=${params}`;
//         }
        
//         // Build query string from filters object
//         const queryParams = new URLSearchParams();
        
//         if (params.user_id) queryParams.append('user_id', params.user_id);
//         if (params.type) queryParams.append('type', params.type);
        
//         const queryString = queryParams.toString();
//         return `/v1/task${queryString ? `?${queryString}` : ''}`;
//       },
//     }),

//     getTeamsByOrganisationId: builder.query({
//       query: (organisationId) => ({
//         url: `/v1/team/getteam/${organisationId}`,
//         method: "GET",
//       }),
//     }),
//     createOrganisation: builder.mutation({
//       query: (organisationData) => ({
//         url: '/v1/org/createorg',
//         method: 'POST',
//         body: { org_name: organisationData },
//       }),
//     }),
//     createTask: builder.mutation({
//       query: (task) => ({
//         url: '/v1/task/create-task',
//         method: 'POST',
//         body: task,
//       }),
//     }),

    
//     deleteTask: builder.mutation({
//       query: (id) => ({
//         url: `/tasks/${id}`,
//         method: 'DELETE',
//       }),
//     }),
    
//     getCompanies: builder.query({
//       query: () => '/v1/org/getall',
//     }),
//     getTask: builder.query({
//       query: () => '/v1/subtask/create-subtask',
//     }),
    
//     me: builder.query({
//       query: (authToken) => ({
//         url: '/v1/auth/me',
//         method: 'GET',
//       }),
//     }),
//     createTeam: builder.mutation({
//       query: (team) => ({
//         url: '/v1/team/createteam',
//         method: 'POST',
//         body: {
//           team_name:team.name,
//           org_id:team.organisationId
//         },
//       }),
//     }),
//     inviteMember: builder.mutation({
//       query: (member) => ({
//         url: '/v1/invitation/invite',
//         method: 'POST',
//         body:{
//           email:member.email,
//           team_id: member.teamId,
//           org_id:member.organisationId
//       },
//       }),
//     }),
//     acceptInvitation: builder.query({
//       query: (token) => `/v1/invitation/validate/${token}`,
//     }),
//     getMemberOfTeamAndOrg: builder.query({
//       query: ({ orgId, teamId }) => `/v1/users/orgteam?org_id=${orgId}&team_id=${teamId}`,
//     }),
//     acceptInvitationPost: builder.mutation({
//       query: ({ token, user_id }) => ({
//         url: `/v1/invitation/accept`,
//         method: 'POST',
//         body: {
//           token: token,
//           user_id: user_id
//         },
//       }),
//     }),
//   createSubtask: builder.mutation({
//     query: (subtask) => ({
//       url: '/v1/subtask/create-subtask',
//       method: 'POST',
//       body: subtask,
//     }),
//   }),
//   getSubtaskByParams: builder.query({
//     query: (task_id) => {
//       console.log("TASK ID ==========>", task_id);
//       return `/v1/subtask/${task_id}`;
//     },
//   }),
//   updateTaskStatus: builder.mutation({
//     query: ({ task_id, status }) => ({
//       url: `/v1/task/update-status/${task_id}`,
//       method: 'PUT',
//       body: {
//         status: status
//       },
//     }),
//   }),
//   updateTask: builder.mutation({
//     query: ({ task_id, ...taskData }) => ({
//       url: `/v1/task/update-task/${task_id}`,
//       method: 'PUT',
//       body: taskData,
//     }),
//   }),
//   updateSubtask: builder.mutation({
//     query: ({ subtask_id, ...subtaskData }) => ({
//       url: `/v1/subtask/update-subtask/${subtask_id}`,
//       method: 'PUT',
//       body: subtaskData,
//     }),
//   }),
//   createSubTaskComment: builder.mutation({
//     query: ({ subtask_id, reply_text }) => ({
//       url: '/v1/subtask/subtask-reply',
//       method: 'POST',
//       body: {
//         subtask_id,
//         reply_text
//       },
//     }),
//   }),

//   getSubTaskComments: builder.query({
//     query: (subtask_id) => `/v1/subtask/reply/${subtask_id}`,
//   }),
// }),
// });
// export const {
//   useCreateOrganisationMutation,
//   useLoginMutation,
//   useMeQuery,
//   useSignupMutation,
//   useVerifyEmailQuery,
//   useGetTasksQuery,
//   useCreateTaskMutation,
//   useDeleteTaskMutation,
//   useGetCompaniesQuery,
//   useCreateTeamMutation,
//   useGetTeamsByOrganisationIdQuery,
//   useInviteMemberMutation,
//   useAcceptInvitationQuery,
//   useGetMemberOfTeamAndOrgQuery,
//   useAcceptInvitationPostMutation,
//   useGetTaskQuery,
//   useCreateSubtaskMutation,
//   useGetSubtaskByParamsQuery,
//   useUpdateTaskStatusMutation,
//   useUpdateTaskMutation,
//   useUpdateSubtaskMutation  ,
//   useCreateSubTaskCommentMutation,
//   useGetSubTaskCommentsQuery
// } = apiSlice;
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
  // Disable caching completely
  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnReconnect: true,
  refetchOnFocus: true,
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
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),
    
    getTasks: builder.query({
      query: (params) => {
        // Handle both old userId parameter and new filters object
        if (typeof params === 'string' || typeof params === 'number') {
          // Backward compatibility for userId only
          return `/v1/task?user_id=${params}`;
        }
        
        // Build query string from filters object
        const queryParams = new URLSearchParams();
        
        if (params.user_id) queryParams.append('user_id', params.user_id);
        if (params.type) queryParams.append('type', params.type);
        
        const queryString = queryParams.toString();
        return `/v1/task${queryString ? `?${queryString}` : ''}`;
      },
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),

    getTeamsByOrganisationId: builder.query({
      query: (organisationId) => ({
        url: `/v1/team/getteam/${organisationId}`,
        method: "GET",
      }),
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),
    createOrganisation: builder.mutation({
      query: (organisationData) => ({
        url: '/v1/org/createorg',
        method: 'POST',
        body: { org_name: organisationData },
      }),
    }),
    createTask: builder.mutation({
      query: (task) => ({
        url: '/v1/task/create-task',
        method: 'POST',
        body: task,
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
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),
    getTask: builder.query({
      query: () => '/v1/subtask/create-subtask',
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),
    
    me: builder.query({
      query: (authToken) => ({
        url: '/v1/auth/me',
        method: 'GET',
      }),
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),
    createTeam: builder.mutation({
      query: (team) => ({
        url: '/v1/team/createteam',
        method: 'POST',
        body: {
          team_name:team.name,
          org_id:team.organisationId
        },
      }),
    }),
    inviteMember: builder.mutation({
      query: (member) => ({
        url: '/v1/invitation/invite',
        method: 'POST',
        body:{
          email:member.email,
          team_id: member.teamId,
          org_id:member.organisationId
      },
      }),
    }),
    acceptInvitation: builder.query({
      query: (token) => `/v1/invitation/validate/${token}`,
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),
    getMemberOfTeamAndOrg: builder.query({
      query: ({ orgId, teamId }) => `/v1/users/orgteam?org_id=${orgId}&team_id=${teamId}`,
      // Disable caching for this query
      keepUnusedDataFor: 0,
    }),
    acceptInvitationPost: builder.mutation({
      query: ({ token, user_id }) => ({
        url: `/v1/invitation/accept`,
        method: 'POST',
        body: {
          token: token,
          user_id: user_id
        },
      }),
    }),
  createSubtask: builder.mutation({
    query: (subtask) => ({
      url: '/v1/subtask/create-subtask',
      method: 'POST',
      body: subtask,
    }),
  }),
  getSubtaskByParams: builder.query({
    query: (task_id) => {
      console.log("TASK ID ==========>", task_id);
      return `/v1/subtask/${task_id}`;
    },
    // Disable caching for this query
    keepUnusedDataFor: 0,
  }),
  updateTaskStatus: builder.mutation({
    query: ({ task_id, status }) => ({
      url: `/v1/task/update-status/${task_id}`,
      method: 'PUT',
      body: {
        status: status
      },
    }),
  }),
  updateTask: builder.mutation({
    query: ({ task_id, ...taskData }) => ({
      url: `/v1/task/update-task/${task_id}`,
      method: 'PUT',
      body: taskData,
    }),
  }),
  updateSubtask: builder.mutation({
    query: ({ subtask_id, ...subtaskData }) => ({
      url: `/v1/subtask/update-subtask/${subtask_id}`,
      method: 'PUT',
      body: subtaskData,
    }),
  }),
  createSubTaskComment: builder.mutation({
    query: ({ subtask_id, reply_text }) => ({
      url: '/v1/subtask/subtask-reply',
      method: 'POST',
      body: {
        subtask_id,
        reply_text
      },
    }),
  }),

  getSubTaskComments: builder.query({
    query: (subtask_id) => `/v1/subtask/reply/${subtask_id}`,
    // Disable caching for this query
    keepUnusedDataFor: 0,
  }),
}),
});

export const {
  useCreateOrganisationMutation,
  useLoginMutation,
  useMeQuery,
  useSignupMutation,
  useVerifyEmailQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useGetCompaniesQuery,
  useCreateTeamMutation,
  useGetTeamsByOrganisationIdQuery,
  useInviteMemberMutation,
  useAcceptInvitationQuery,
  useGetMemberOfTeamAndOrgQuery,
  useAcceptInvitationPostMutation,
  useGetTaskQuery,
  useCreateSubtaskMutation,
  useGetSubtaskByParamsQuery,
  useUpdateTaskStatusMutation,
  useUpdateTaskMutation,
  useUpdateSubtaskMutation  ,
  useCreateSubTaskCommentMutation,
  useGetSubTaskCommentsQuery
} = apiSlice;