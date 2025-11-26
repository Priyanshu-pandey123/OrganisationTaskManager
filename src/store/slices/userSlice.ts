import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { apiSlice } from '../apiSlice';

interface User {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  is_verified?: boolean;
  verification_token?: string;
  // Add other user fields as needed
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  // Handle the API query responses
  extraReducers: (builder) => {
    builder
      .addMatcher(
        apiSlice.endpoints.me.matchPending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.me.matchFulfilled,
        (state, action) => {
          state.currentUser = action.payload;
          state.isLoading = false;
          state.error = null;
        }
      )
      .addMatcher(
        apiSlice.endpoints.me.matchRejected,
        (state, action) => {
          state.isLoading = false;
          state.error = action.error?.message || 'Failed to fetch user data';
        }
      );
  },
});

export const { setCurrentUser, clearCurrentUser, setUserLoading, setUserError } = userSlice.actions;
export default userSlice.reducer;
