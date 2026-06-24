import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../contexts/ProfileContext";
import {
  uploadPhoto,
  getPhotoUrl,
  uploadResume,
  getResumeInfo,
  getResumeDownloadUrl,
  deleteResume,
} from "../api/auth";

function SkillInput({ skills, onChange }) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInput("");
  };

  const remove = (index) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 text-xs border border-gray-700/50"
          >
            {skill}
            <button type="button" onClick={() => remove(i)} className="text-gray-500 hover:text-red-400 ml-0.5">
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type a skill and press Enter"
          className="flex-1 bg-black/40 border border-gray-700/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 rounded-lg bg-yellow-500/20 text-yellow-400 text-sm hover:bg-yellow-500/30 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function ResumePreviewModal({ resumeInfo, onClose }) {
  const isImage = resumeInfo?.mime?.startsWith("image/");
  const isPdf = resumeInfo?.mime === "application/pdf";
  const downloadUrl = getResumeDownloadUrl(resumeInfo?.uid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-[#1a1a1a] border border-gray-700/50 rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white text-sm font-medium">{resumeInfo?.filename || "Resume"}</h3>
              <p className="text-gray-500 text-xs">{resumeInfo?.mime?.split("/")[1]?.toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Download
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {isImage ? (
            <img src={downloadUrl} alt="Resume preview" className="w-full h-auto rounded-lg" />
          ) : isPdf ? (
            <iframe src={downloadUrl} className="w-full h-[65vh] rounded-lg border border-gray-700/30" title="Resume preview" />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <svg className="w-12 h-12 mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <p className="text-sm">Preview not available for this file type</p>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 px-4 py-2 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors"
              >
                Download to view
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const fileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [resumeInfo, setResumeInfo] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);

  const role = user?.role || "student";

  useEffect(() => {
    if (role === "student") {
      getResumeInfo()
        .then((res) => setResumeInfo(res.data))
        .catch(() => setResumeInfo(null));
    }
  }, [role]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadPhoto(file);
      await updateProfile({ photo_url: res.data.photo_url });
    } catch {
      // silently fail
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("File size must be less than 5 MB");
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      return;
    }
    setUploadingResume(true);
    try {
      await uploadResume(file);
      const res = await getResumeInfo();
      setResumeInfo(res.data);
      await updateProfile({ resume_url: `/resume/${user.uid}` });
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to upload resume. Please try again.";
      alert(msg);
    } finally {
      setUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const handleDeleteResume = async () => {
    if (!confirm("Are you sure you want to delete your resume?")) return;
    try {
      await deleteResume();
      setResumeInfo(null);
      await updateProfile({ resume_url: null });
    } catch {
      // silently fail
    }
  };

  const startEditing = () => {
    setForm({
      display_name: profile?.display_name || "",
      skills: profile?.skills ? [...profile.skills] : [],
      company_name: profile?.company_name || "",
      company_email: profile?.company_email || "",
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setForm({});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (role === "student") {
        await updateProfile({ display_name: form.display_name, skills: form.skills });
      } else {
        await updateProfile({
          display_name: form.display_name,
          company_name: form.company_name,
          company_email: form.company_email,
        });
      }
      setEditing(false);
      setForm({});
    } catch {
      // silently fail
    } finally {
      setSaving(false);
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
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800/50 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-amber-900/70 via-amber-800/50 to-amber-950/40" />

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
            <div className="pb-1 flex-1">
              {editing ? (
                <input
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="bg-black/40 border border-gray-700/50 rounded-lg px-3 py-1.5 text-lg font-semibold text-white focus:outline-none focus:border-yellow-500/50 w-full max-w-xs"
                />
              ) : (
                <h1 className="text-2xl font-semibold text-white">{displayName}</h1>
              )}
              <p className="text-gray-400 text-sm">{email}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>

            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg text-sm bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            ) : (
              <button
                onClick={startEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-700/50 hover:border-gray-600 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Edit
              </button>
            )}
          </div>

          <div className="border-t border-gray-700/50" />

          <div className="mt-5">
            {role === "student" && (
              <div className="flex gap-6">
                <div className="flex-1">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                  {editing ? (
                    <SkillInput
                      skills={form.skills}
                      onChange={(skills) => setForm({ ...form, skills })}
                    />
                  ) : (
                    profile?.skills?.length > 0 ? (
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
                    ) : (
                      <p className="text-gray-500 text-sm italic">No skills added yet.</p>
                    )
                  )}
                </div>

                <div className="w-52 flex-shrink-0">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Resume</p>
                  <input
                    ref={resumeInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={handleResumeChange}
                  />

                  {resumeInfo ? (
                    <div className="rounded-xl border border-gray-700/50 bg-white/[0.02] overflow-hidden">
                      <div className="px-3 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-xs font-medium truncate">{resumeInfo.filename}</p>
                            <p className="text-gray-500 text-[10px]">{resumeInfo.mime?.split("/")[1]?.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setShowResumePreview(true)}
                            className="flex-1 px-2 py-1.5 rounded-lg text-[11px] bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
                          >
                            Preview
                          </button>
                          <a
                            href={getResumeDownloadUrl(user.uid)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-2 py-1.5 rounded-lg text-[11px] bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-center"
                          >
                            Download
                          </a>
                          <button
                            onClick={handleDeleteResume}
                            className="px-2 py-1.5 rounded-lg text-[11px] bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => resumeInputRef.current?.click()}
                      disabled={uploadingResume}
                      className="w-full rounded-xl border border-dashed border-gray-700/50 bg-white/[0.02] px-3 py-3 flex flex-col items-center gap-1 hover:border-gray-600/50 hover:bg-white/[0.04] transition-all cursor-pointer group"
                    >
                      {uploadingResume ? (
                        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      ) : null}
                      <p className="text-gray-300 text-[11px] font-medium leading-tight">Upload Resume</p>
                      <p className="text-gray-500 text-[9px] leading-tight">PDF, DOC, IMG - max 5 MB</p>
                    </button>
                  )}
                </div>
              </div>
            )}

            {role === "recruiter" && (
              <>
                <div className="mb-4">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Company</p>
                  {editing ? (
                    <input
                      value={form.company_name}
                      onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                      placeholder="Company name"
                      className="w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                    />
                  ) : (
                    <p className="text-white">{profile?.company_name || <span className="text-gray-500 text-sm italic">Not set</span>}</p>
                  )}
                </div>
                <div className="mb-4">
                  <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-1">Company Email</p>
                  {editing ? (
                    <input
                      value={form.company_email}
                      onChange={(e) => setForm({ ...form, company_email: e.target.value })}
                      placeholder="company@example.com"
                      className="w-full bg-black/40 border border-gray-700/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50"
                    />
                  ) : (
                    <p className="text-white">{profile?.company_email || <span className="text-gray-500 text-sm italic">Not set</span>}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showResumePreview && resumeInfo && (
        <ResumePreviewModal resumeInfo={resumeInfo} onClose={() => setShowResumePreview(false)} />
      )}
    </div>
  );
}
