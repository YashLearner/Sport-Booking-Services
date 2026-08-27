import { useSelector } from "react-redux";
import {
  selectAuthError,
  selectAuthStatus,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../features/auth/authSlice.js";

// Thin convenience hook so components don't each import 4 separate
// selectors from authSlice — used by Navbar, Dashboard, Profile.
export default function useAuth() {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === "admin",
    status,
    error,
    isLoading: status === "loading",
  };
}
