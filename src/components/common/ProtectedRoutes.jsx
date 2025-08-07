import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../components/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" state={{ from: location }} replace />;
}