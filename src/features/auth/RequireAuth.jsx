import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadingPage from "../../components/LoadingPage";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();

  const { user, isInitialized, isAuthenticated } = useAuth();

  if (!isInitialized) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Content to be rendered
  // 'roles.some' means that if any of the roles is included, then that's good enough
  // The 'allowedRoles' array will be passed in as a prop
  // This is to protect the routes that are only for managers and admins. If anyone else wants to access these protected routes, they'll be sent back to the login page
  // 'replace' is used to replace the current entry in the history stack instead of adding a new one -> We do this to allow the user to go back to the page that they were trying to access before logging in if they have logged in successfully
  const content = allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );

  return content;
};

export default RequireAuth;
