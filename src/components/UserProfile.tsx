import React, { useEffect } from 'react';
import { useMeQuery } from '../store/apiSlice';
import { useCurrentUser, useUserLoading, useUserError } from '../store/hooks';

const UserProfile = () => {
  // Trigger the me query to fetch user data
  const { data: userData, isLoading, error } = useMeQuery();
  
  // Or use the user state from the slice
  const currentUser = useCurrentUser();
  const userLoading = useUserLoading();
  const userError = useUserError();

  // The user slice will automatically update when the me query completes
  // due to the extraReducers in the userSlice

  if (userLoading || isLoading) {
    return <div>Loading user data...</div>;
  }

  if (userError || error) {
    return <div>Error: {userError || error?.message}</div>;
  }

  return (
    <div>
      <h2>Welcome, {currentUser?.full_name || currentUser?.name}!</h2>
      <p>Email: {currentUser?.email}</p>
    </div>
  );
};

export default UserProfile;
