import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name?: string;
  is_verified?: boolean;
  verification_token?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showVerificationModal: boolean;
  pendingVerificationUser: User | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: false,
  error: null,
  showVerificationModal: false,
  pendingVerificationUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      // Persist token
      localStorage.setItem('auth_token', action.payload.token);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string; is_verified?: boolean; verification_token?: string }>) => {
      const { user, token, is_verified, verification_token } = action.payload;
      
      if (is_verified === false) {
        // User registered but not verified - show verification modal and stay on login
        state.pendingVerificationUser = {
          ...user,
          is_verified: false,
          verification_token
        };
        state.showVerificationModal = true;
        state.isLoading = false;
        state.error = null;
      } else {
        // User is verified - proceed with normal registration success
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        localStorage.setItem('auth_token', token);
      }
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear token
      localStorage.removeItem('auth_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure, 
  logout, 
  clearError,
  closeVerificationModal
} = authSlice.actions;
export default authSlice.reducer;