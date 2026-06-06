export function normalizeStudentProfile(profile) {
  if (!profile) return null;

  const normalizeSkills = (skills) => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string' && skills.trim()) {
      return skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  return {
    ...profile,
    full_name: profile.full_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    college_name: profile.college_name || '',
    branch: profile.branch || '',
    graduation_year: profile.graduation_year || '',
    skills: normalizeSkills(profile.skills),
    resume_url: profile.resume_url || '',
    profile_photo_url: profile.profile_photo_url || '',
    account_status: profile.account_status || 'Active',
    role: profile.role || 'Student',
    updated_at: profile.updated_at || null,
  };
}

export function validateStudentProfile(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid profile data' };
  }
  if (data.skills !== undefined && !Array.isArray(data.skills) && typeof data.skills !== 'string') {
    return { valid: false, error: 'skills must be an array or string' };
  }
  return { valid: true, error: null };
}
