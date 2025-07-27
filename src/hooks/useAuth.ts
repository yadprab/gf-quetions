import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin, fetchUser } from "../services/apiService";
import useStore from "../store/useStore";
import { ENDPOINTS } from "../config";
import { API_CONFIG } from "../config/env";

let refreshTimeout: NodeJS.Timeout;

export const useAuth = () => {
  const { user, setUser, isLoading, error, setError } = useStore();
  const navigate = useNavigate();

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${ENDPOINTS.auth.refresh}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Token refresh failed");

      const data = await response.json();

      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(refreshToken, (data.expires_in - 60) * 1000);

      return data.access_token;
    } catch (err) {
      console.error("Token refresh error:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await refreshToken();
        if (!token) {
          return;
        }

        const userData = await fetchUser(user?.id || "");
        setUser(userData);
      } catch (err) {
        console.error("Auth check failed:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    checkAuth();
  }, [refreshToken, setUser, setError, user?.id]);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiLogin(email, password);
      setUser(data.user);
      navigate("/dashboard");

      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      return false;
    }
  };

  const logout = async () => {
    try {
      fetch(`${API_CONFIG.BASE_URL}${ENDPOINTS.auth.logout}`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      clearTimeout(refreshTimeout);
      navigate("/login");
    }
  };

  const hasPermission = (permission: string) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    hasPermission,
    refreshToken,
  };
};

export default useAuth;
