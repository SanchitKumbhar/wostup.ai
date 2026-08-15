import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { useCurrentUser } from '../hooks/useUser';

export default function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const { data: user, isLoading: isUserLoading } = useCurrentUser();

  if (!isLoaded || (isSignedIn && isUserLoading)) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <div className="pulse-dot" style={{ width: '20px', height: '20px', backgroundColor: '#5B5FFB', borderRadius: '50%' }}></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Profile setup is now optional and handled in Settings. 
  // If they somehow land on /onboarding/profile, redirect them to dashboard.
  const isProfileRoute = location.pathname.startsWith('/onboarding/profile');
  if (isProfileRoute) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
