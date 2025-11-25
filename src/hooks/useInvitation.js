import { useEffect, useState } from 'react';
import { useAcceptInvitationQuery, useAcceptInvitationPostMutation } from '../store/apiSlice';
import { useAppSelector } from '../store/hooks';

export const useInvitationValidation = (token) => {
  const { data, error, isLoading, isSuccess, isError } = useAcceptInvitationQuery(token, {
    skip: !token,
  });

  return {
    invitedEmail: data?.invited_email,
    userExists: data?.exists,
    validationError: error,
    isValidating: isLoading,
    isValidated: isSuccess,
    validationFailed: isError,
  };
};

export const useAcceptInvitation = () => {
  const [acceptInvitation, { isLoading, error, isSuccess }] = useAcceptInvitationPostMutation();
  const { user } = useAppSelector(state => state.auth);

  const acceptInvite = async (token) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    try {
      const result = await acceptInvitation({
        token,
        user_id: user.id
      }).unwrap();
      return result;
    } catch (err) {
      throw err;
    }
  };

  return {
    acceptInvite,
    isAccepting: isLoading,
    acceptError: error,
    acceptSuccess: isSuccess,
  };
};
