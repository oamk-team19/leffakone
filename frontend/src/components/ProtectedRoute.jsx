import { useUser } from '../context/useUser';

import { Outlet, Navigate } from 'react-router-dom';

//checks if user has signed in. If not, user will be redirected to signin route.
export default function ProtectedRoute() {
  const { user } = useUser();

  if (!user || !user.token) {
    //alert('ProtectedRoute error');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
