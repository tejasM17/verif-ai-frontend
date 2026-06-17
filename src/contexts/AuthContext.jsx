import { createContext, useState, useEffect } from "react";
import { getMe, login as apiLogin, signup as apiSignup } from "../api/auth";
import { getToken, setToken, removeToken } from "../utils/token";

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

  const signupUser = async (email, password) => {
    const res = await apiSignup(email, password);
    return res.data;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, signupUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
