import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userId = sessionStorage.getItem('UserId');

  if (!userId || userId.length <= 10) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
