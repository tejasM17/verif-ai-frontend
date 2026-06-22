import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../contexts/ProfileContext";
import { uploadPhoto, getPhotoUrl } from "../api/auth";

export default function Profile() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const role = user?.role || "student";

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadPhoto(file);
      updateProfile({ photo_url: res.data.photo_url });
    } catch {
      // silently fail
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = profile?.display_name || user?.displayName || "User";
  const email = profile?.email || user?.email || "";
  const photoUrl = getPhotoUrl(profile?.photo_url);
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-fade-in">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      {/* Profile Card */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 overflow-hidden">
        {/* Header */}
        <div className="h-28 bg-gradient-to-r from-amber-900/70 via-amber-800/50 to-amber-950/40" />

        {/* Avatar + Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end gap-5 -mt-12 mb-5">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="relative group w-24 h-24 rounded-full border-4 border-[#1a1a1a] flex-shrink-0 cursor-pointer overflow-hidden"
            >
              {photoUrl ? (
                <img src={photoUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-black font-bold text-3xl">
                  {initial}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {uploading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                )}
              </div>
            </button>
            <div className="pb-1">
              <h1 className="text-2xl font-semibold text-white">{displayName}</h1>
              <p className="text-gray-400 text-sm">{email}</p>
            </div>
          </div>

          {/* Role Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700/50" />

          {/* Details */}
          <div className="mt-5">
            {/* Student fields */}
            {role === "student" && (
              <>
                <div className="flex gap-8 mb-5">
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Trust Score</p>
                    <p className="text-white text-lg font-bold">
                      {profile?.trust_score ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Verified</p>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <p className="text-gray-400 text-sm font-medium">No</p>
                    </div>
                  </div>
                </div>

                {profile?.skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 text-xs border border-gray-700/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile?.github_url && (
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">GitHub</p>
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-400 hover:text-accent-300 text-sm transition-colors"
                    >
                      {profile.github_url}
                    </a>
                  </div>
                )}
              </>
            )}

            {/* Recruiter fields */}
            {role === "recruiter" && (
              <>
                {profile?.company_name && (
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Company</p>
                    <p className="text-white">{profile.company_name}</p>
                  </div>
                )}
                {profile?.company_email && (
                  <div className="mb-4">
                    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Company Email</p>
                    <p className="text-white">{profile.company_email}</p>
                  </div>
                )}
              </>
            )}

            {/* No extra data */}
            {((role === "student" && !profile?.skills?.length && !profile?.github_url) ||
              (role === "recruiter" && !profile?.company_name && !profile?.company_email)) && (
              <p className="text-gray-500 text-sm italic">
                No additional profile information yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
