import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Or your auth system

export default function RequireAuth({ children, role }) {
  const { user } = useAuth(); // Or your user state

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}