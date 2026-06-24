import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { getProfile, updateProfile as updateProfileApi } from "../api/auth";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);

  const refreshProfile = useCallback(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const updateProfile = async (updates) => {
    const res = await updateProfileApi(updates);
    setProfile(res.data);
    return res.data;
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
