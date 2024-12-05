import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useUser();
  const location = useLocation();

  console.log('RoleGuard Debug:');
  console.log('1. Current user:', JSON.stringify(user, null, 2));
  console.log('2. Allowed roles:', allowedRoles);
  console.log('3. Is Loading:', isLoading);
  console.log('4. Current location:', location.pathname);

  // If still loading, you might want to show a loading indicator
  if (isLoading) {
    console.log('5. Still loading user data');
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('6. No user found - redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = allowedRoles.includes(user.userGroup);
  console.log('7. Role check:', {
    userGroup: user.userGroup,
    allowedRoles,
    hasRequiredRole,
  });

  if (!hasRequiredRole) {
    console.log('8. User does not have required role - redirecting to dashboard');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  console.log('9. Access granted - rendering protected content');
  return <>{children}</>;
}
