import api from '../lib/api';

export const studentService = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),

  uploadPhoto: (formData) =>
    api.upload('/student/profile/photo', formData),

  getPhoto: () => api.get('/student/profile/photo'),

  deletePhoto: () => api.delete('/student/profile/photo'),
};
