import api from '../lib/api';

export const recruiterService = {
  getApplications: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.sort_by) query.set('sort_by', params.sort_by);
    if (params.page) query.set('page', params.page);
    if (params.page_size) query.set('page_size', params.page_size);
    const qs = query.toString();
    return api.get(`/recruiter/applications${qs ? `?${qs}` : ''}`);
  },

  getApplication: (id) =>
    api.get(`/recruiter/applications/${id}`),

  updateApplicationStatus: (id, status) =>
    api.patch(`/recruiter/applications/${id}/status`, { status }),

  getVerification: (applicationId) =>
    api.get(`/recruiter/applications/${applicationId}/verification`),

  getDashboardStats: () =>
    api.get('/recruiter/dashboard/stats'),
};

export default recruiterService;
