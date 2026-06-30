import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authcontext.js";
import {
  AUTH_REFRESH_TOKEN_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_LAST_LOGIN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  getCurrentUser,
  login as apiLogin,
  logout as apiLogout,
} from "../services/api.js";

function readStoredUser() {
  try {
    const value = sessionStorage.getItem(AUTH_USER_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    if (!sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)) {
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch(() => {
        sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
        setUser(null);
      });
  }, []);

  async function signIn(credentials) {
    const body = await apiLogin(credentials);
    setUser(body.user);
    return body;
  }

  async function signOut() {
    await apiLogout().catch(() => {});
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_REFRESH_TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_LAST_LOGIN_STORAGE_KEY);
    setUser(null);
  }

  const value = useMemo(() => {
    const hasFullAccess = user?.role === "ADMIN" || user?.role === "DIRECTOR";

    return {
      user,
      isAuthenticated: Boolean(user && sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY)),
      hasFullAccess,
      hasAccess(access) {
        return hasFullAccess || Boolean(user?.accesses?.includes(access));
      },
      can(resource, action) {
        return hasFullAccess || Boolean(user?.accesses?.includes(`${resource}:${action}`));
      },
      signIn,
      signOut,
      setUser,
    };
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
