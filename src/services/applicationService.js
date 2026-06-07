import api from '../lib/api';

export const applicationService = {
  submit: (companyId, formData) =>
    api.upload(`/student/applications?company_id=${companyId}`, formData),

  getMyApplications: () =>
    api.get('/student/applications'),

  getApplication: (id) =>
    api.get(`/student/applications/${id}`),
};
