/* eslint-disable react-hooks/set-state-in-effect */
import { createContext, useState, useEffect } from "react";
import {
  getMe,
  login as apiLogin,
  signup as apiSignup,
  googleLogin as apiGoogleLogin,
  githubLogin as apiGithubLogin,
  updateRole as apiUpdateRole,
} from "../api/auth";
import { getToken, setToken, removeToken } from "../utils/token";
import { signInWithGoogle } from "../services/googleAuth";
import { signInWithGithub } from "../services/githubAuth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then((res) => setUser(res.data))
        .catch(() => removeToken())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    const res = await apiLogin(email, password);
    setToken(res.data.idToken);
    const me = await getMe();
    setUser(me.data);
    return me.data;
  };

  const signupUser = async (email, password, role) => {
    const res = await apiSignup(email, password, role);
    return res.data;
  };

  const googleLoginUser = async () => {
    const { idToken } = await signInWithGoogle();
    const res = await apiGoogleLogin(idToken);
    setToken(res.data.idToken);
    const me = await getMe();
    setUser(me.data);
    return { ...me.data, role: me.data.role || "student" };
  };

  const githubLoginUser = async () => {
    const { idToken } = await signInWithGithub();
    const res = await apiGithubLogin(idToken);
    setToken(res.data.idToken);
    const me = await getMe();
    setUser(me.data);
    return { ...me.data, role: me.data.role || "student" };
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  // Switch the current account's role. Used when a recruiter hits the
  // dashboard with role=None (legacy signup) or wants to flip between
  // student/recruiter without signing out.
  const switchRole = async (role) => {
    await apiUpdateRole(role);
    const me = await getMe();
    setUser(me.data);
    return me.data;
  };

  const userRole = user?.role || "student";

  return (
    <AuthContext.Provider
      value={{ user, loading, userRole, loginUser, signupUser, googleLoginUser, githubLoginUser, logout, switchRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}
