import api from '../lib/api';

export const companyService = {
  listCompanies: (params = {}) => {
    const query = new URLSearchParams();
    if (params.tech_stack) query.set('tech_stack', params.tech_stack);
    if (params.skills) query.set('skills', params.skills);
    if (params.hiring_status) query.set('hiring_status', params.hiring_status);
    if (params.has_internships) query.set('has_internships', params.has_internships);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page);
    if (params.page_size) query.set('page_size', params.page_size);
    const qs = query.toString();
    return api.get(`/companies${qs ? `?${qs}` : ''}`);
  },

  getCompany: (id) => api.get(`/companies/${id}`),

  saveCompany: (companyId) => api.post(`/student/saved-companies?company_id=${companyId}`),

  getSavedCompanies: () => api.get('/student/saved-companies'),

  removeSavedCompany: (companyId) => api.delete(`/student/saved-companies/${companyId}`),
};
