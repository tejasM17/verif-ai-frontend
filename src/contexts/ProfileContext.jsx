import { createContext, useState, useEffect, useContext } from "react";
import { getProfile } from "../api/auth";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  const updateProfile = (updates) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
