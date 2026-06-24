import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../contexts/ProfileContext";
import { deleteProfile as deleteProfileApi } from "../api/auth";

export default function Settings() {
  const { logout } = useAuth();
  const { refreshProfile } = useProfile();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProfileApi();
      refreshProfile();
      setConfirmDelete(false);
      logout();
      navigate("/login");
    } catch {
      // silently fail
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <h1 className="text-2xl font-semibold text-white mb-8">Settings</h1>

      {/* Delete Profile Section */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-red-900/30 overflow-hidden">
        <div className="px-6 py-5">
          <p className="text-sm text-gray-400 mb-4">Permanently delete your profile and all associated data.</p>
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-400">Are you sure?</p>
              <button
                onClick={handleDelete}
                className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white border border-gray-700/50 transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-1.5 rounded-lg text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
            >
              Delete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
