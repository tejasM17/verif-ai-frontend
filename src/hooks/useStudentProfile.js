import { useState, useEffect, useCallback, useRef } from 'react';
import { studentService } from '../services/studentService';
import { normalizeStudentProfile, validateStudentProfile } from '../lib/normalizeStudentProfile';

export function useStudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const fetchRef = useRef(false);

  const fetchProfile = useCallback(async () => {
    if (fetchRef.current) return;
    fetchRef.current = true;

    try {
      const response = await studentService.getProfile();
      const raw = response.data || response;

      const validation = validateStudentProfile(raw);
      if (!validation.valid) {
        console.warn('[Profile] Validation warning:', validation.error);
      }

      const normalized = normalizeStudentProfile(raw);
      setError(null);
      setProfile(normalized);
    } catch (err) {
      if (err.status === 401) return;
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data) => {
    try {
      setSaving(true);
      setError(null);
      const response = await studentService.updateProfile(data);
      const raw = response.data || response;
      const normalized = normalizeStudentProfile(raw);
      setProfile(normalized);
      return { success: true };
    } catch (err) {
      const message = err.message || 'Failed to update profile';
      setError(message);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    return () => {
      fetchRef.current = false;
    };
  }, [fetchProfile]);

  const completion = calculateCompletion(profile);

  return {
    profile,
    loading,
    error,
    saving,
    completion,
    refreshProfile: () => fetchProfile(false),
    updateProfile,
  };
}

function calculateCompletion(profile) {
  if (!profile) return 0;
  const fields = [
    'full_name',
    'email',
    'phone',
    'college_name',
    'branch',
    'graduation_year',
    'skills',
    'resume_url',
  ];
  const filled = fields.filter((f) => {
    const val = profile[f];
    if (Array.isArray(val)) return val.length > 0;
    return val !== null && val !== undefined && val !== '';
  }).length;
  return Math.round((filled / fields.length) * 100);
}
