import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginMutation, useMeQuery, useAcceptInvitationPostMutation } from '../store/apiSlice';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess, loginFailure } from '../store/slices/authSlice';
import { useAcceptInvitation } from '../hooks/useInvitation';

const Login = ({ onToggleForm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [acceptInvitationPost] = useAcceptInvitationPostMutation();
  const { acceptInvite, isAccepting, acceptError } = useAcceptInvitation();
  
  // State to track if we should fetch profile after login
  const [shouldFetchProfile, setShouldFetchProfile] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  
  // Fetch user profile when shouldFetchProfile is true
  const { data: profileData, isLoading: isProfileLoading, error: profileError } = useMeQuery(authToken, {
    skip: !shouldFetchProfile || !authToken,
  });

  console.log(profileData);

  // Get invitation data from navigation state
  const invitedEmail = location.state?.invitedEmail;
  const invitationToken = location.state?.invitationToken;
  const isInvitationFlow = !!invitationToken;

  const [formData, setFormData] = useState({
    email: invitedEmail || '', // Pre-fill email for invitation flow
    password: '',
  });

  const [invitationError, setInvitationError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Sync theme with localStorage and document body
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Clear invitation error when component unmounts or form changes
  useEffect(() => {
    return () => setInvitationError('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear invitation error when user starts typing
    if (invitationError) {
      setInvitationError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      // If login successful, dispatch success
      dispatch(loginSuccess({
        user: result.user,
        token: result.token,
      }));

      // If this is an invitation flow, trigger profile fetch
      if (isInvitationFlow) {
        setAuthToken(result.token);
        setShouldFetchProfile(true);
      } else {
        toast.success('Login successful! Welcome back.');
        navigate("/taskManager");
      }
    } catch (error) {
      localStorage.removeItem('invite_token');
      // Handle login failure
      const errorMessage = error?.data?.message || 'Login failed. Please try again.';
      dispatch(loginFailure(errorMessage));
      toast.error(errorMessage);
    }
  };

  // Effect to handle invitation acceptance after profile is fetched
  useEffect(() => {
    if (shouldFetchProfile && profileData && !isProfileLoading) {
      console.log('inside invitation acceptance');
      const handleInvitationAcceptance = async () => {
        try {
          if (profileError) {
            throw new Error('Failed to fetch user profile');
          }

          // Use user_id from the profile API response
          const userId = profileData?.data?.user_id;

          if (!userId) {
            throw new Error('User ID not found in profile');
          }

          // Accept the invitation using the user_id from profile
          await acceptInvitationPost({
            token: invitationToken,
            user_id: userId
          }).unwrap();

          toast.success('Login successful! Welcome to the team.');
          
          // Clear invitation token and redirect to success page
          localStorage.removeItem('invite_token');
          navigate('/team-joined', { replace: true });
        } catch (inviteError) {
          // Handle invitation acceptance error
          localStorage.removeItem('invite_token');
          const errorMsg = inviteError?.data?.message || inviteError?.message || 'Login successful, but failed to accept invitation.';
          
          if (errorMsg.includes('email does not match')) {
            setInvitationError('Invitation email does not match your account. Please use the correct account.');
            // Don't redirect - let user try again
            return;
          } else {
            toast.error(errorMsg);
            navigate('/taskManager');
          }
        } finally {
          // Reset state
          setShouldFetchProfile(false);
          setAuthToken(null);
        }
      };

      handleInvitationAcceptance();
    }
  }, [profileData, isProfileLoading, profileError, shouldFetchProfile, invitationToken, authToken, navigate, acceptInvitationPost]);
  return (
    <div className='flex flex-row items-center justify-center px-[150px] min-h-screen '>
   
     <div className=" lg:flex w-1/2 ">

      {/* Floating soft blobs */}
      <div className="absolute -top-20 -left-16 w-72 h-72 bg-indigo-700/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-700/30 blur-3xl rounded-full animate-bounce" />
      <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-blue-600/20 blur-2xl rounded-full animate-ping" />

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent"></div>

      {/* Content */}
      <div className="z-1  text-center animate-fadeIn border-white border-1">



        {/* Heading */}
        <h1 className="text-5xl font-extrabold leading-tight  
          bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 
          text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]
          animate-slideUp">
          Organisation <br/> Task Manager
        </h1>

        {/* Typing line */}
        <p className="text-gray-300 text-lg h-6 mt-3 animate-typing overflow-hidden whitespace-nowrap border-r-2 border-indigo-400">
          Collaborate • Organise • Track Tasks • Grow Faster
        </p>

        {/* Features */}
        <div className="mt-10 space-y-3 text-gray-300 text-sm mx-auto w-fit">

<div className="flex items-center space-x-2 animate-slideInLeft delay-[0.2s]">
  <span className="w-3 h-3 rounded-full bg-green-400"></span>
  <span>Team Collaboration</span>
</div>

<div className="flex items-center space-x-2 animate-slideInRight delay-[0.4s]">
  <span className="w-3 h-3 rounded-full bg-blue-400"></span>
  <span>Real-time Updates</span>
</div>

<div className="flex items-center space-x-2 animate-slideInLeft delay-[0.6s]">
  <span className="w-3 h-3 rounded-full bg-purple-400"></span>
  <span>Smart Task Management</span>
</div>

</div>

      </div>
    </div>
    <div className="flex  z-30 items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 sm:p-10">
          <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-extrabold leading-tight text-center  
          bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 
          text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]
          animate-slideUp">
              {isInvitationFlow ? 'Join Your Team' : 'Sign in to your account'}
            </h2>
          
          </div>
        
          <p className="text-center text-md text-gray-500 dark:text-gray-400 mb-8 font-extrabold leading-tight  
          bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 
          text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]
          animate-slideUp">
            {isInvitationFlow 
              ? `Welcome! Please sign in with ${invitedEmail} to join your team.` 
              : 'Welcome back!'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email or Username {isInvitationFlow && '(Required)'}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isInvitationFlow && !!invitedEmail} // Disable if pre-filled for invitation
                  className={`appearance-none block w-full px-4 py-2 border rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition duration-150 ${
                    isInvitationFlow && invitedEmail 
                      ? 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-600 cursor-not-allowed' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder={isInvitationFlow ? invitedEmail : "you@example.com"}
                />
              </div>
              {isInvitationFlow && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  You must use the invited email address to join the team.
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm transition duration-150"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? (
                    // Eye off icon (password hidden)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    // Eye icon (password visible)
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Invitation Error */}
            {invitationError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-md">
                {invitationError}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-200"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to={'/forget-password'}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || isAccepting || (shouldFetchProfile && isProfileLoading)}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition duration-150 ease-in-out ${
                  isLoading || isAccepting || (shouldFetchProfile && isProfileLoading)
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {(isLoading || isAccepting || (shouldFetchProfile && isProfileLoading)) ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                 ) : (
                  isInvitationFlow ? 'Join Team' : 'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Toggle to Register */}
          {!isInvitationFlow && (
            <div className="text-center mt-6">
              <p className="text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={onToggleForm}
                  className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition duration-200"
                >
                  Create one here
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    
  );
};

export default Login;