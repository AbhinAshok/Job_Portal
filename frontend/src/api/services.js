import { api, unwrapList } from "./client";

export const authApi = {
  register: (payload) => api.post("api/auth/register/", payload),
  login: (payload) => api.post("auth/login/", payload),
  logout: (refresh) => api.post("api/auth/logout/", { refresh }),
  me: () => api.get("api/auth/me/"),
  updateMe: (payload) => api.patch("api/auth/me/", payload),
  changePassword: (payload) => api.post("api/auth/password/change/", payload),
  forgotPassword: (email) => api.post("api/auth/password/reset/", { email }),
  resetPassword: (payload) => api.post("api/auth/password/reset/confirm/", payload),
  candidateProfile: () => api.get("api/auth/profile/candidate/"),
  updateCandidateProfile: (form) => api.patch("api/auth/profile/candidate/", form),
  recruiterProfile: () => api.get("api/auth/profile/recruiter/"),
  updateRecruiterProfile: (payload) => api.patch("api/auth/profile/recruiter/", payload)
};

export const companiesApi = {
  list: (params = {}) => api.get("api/companies/", { params }),
  detail: (id) => api.get(`companies/${id}/`),
  create: (form) => api.post("api/companies/", form),
  update: (id, form) => api.patch(`companies/${id}/`, form),
  remove: (id) => api.delete(`companies/${id}/`),
  mine: (params = {}) => api.get("api/companies/mine/", { params })
};

export const jobsApi = {
  list: (params = {}) => api.get("api/jobs/", { params }),
  detail: (id) => api.get(`jobs/${id}/`),
  create: (payload) => api.post("jobs/", payload),
  update: (id, payload) => api.patch(`jobs/${id}/`, payload),
  remove: (id) => api.delete(`jobs/${id}/`),
  mine: (params = {}) => api.get("api/jobs/my_jobs/", { params })
};

export const applicationsApi = {
  list: (params = {}) => api.get("api/applications/", { params }),
  detail: (id) => api.get(`applications/${id}/`),
  create: (form) => api.post("api/applications/", form),
  updateStatus: (id, status) => api.patch(`applications/${id}/update_status/`, { status })
};

export const resumesApi = {
  list: (params = {}) => api.get("api/resumes/", { params }),
  detail: (id) => api.get(`resumes/${id}/`),
  create: (form) => api.post("api/resumes/", form),
  update: (id, form) => api.patch(`resumes/${id}/`, form),
  remove: (id) => api.delete(`resumes/${id}/`),
  setDefault: (id) => api.post(`resumes/${id}/set_default/`)
};

export const interviewsApi = {
  list: (params = {}) => api.get("api/interviews/", { params }),
  detail: (id) => api.get(`interviews/${id}/`),
  upcoming: () => api.get("api/interviews/upcoming/"),
  create: (payload) => api.post("api/interviews/", payload),
  update: (id, payload) => api.patch(`api/interviews/${id}/`, payload),
  remove: (id) => api.delete(`interviews/${id}/`),
  updateStatus: (id, status) => api.patch(`interviews/${id}/update_status/`, { status })
};

export const notificationsApi = {
  list: (params = {}) => api.get("api/notifications/", { params }),
  detail: (id) => api.get(`notifications/${id}/`),
  remove: (id) => api.delete(`notifications/${id}/`),
  markRead: (id) => api.patch(`notifications/${id}/mark_as_read/`),
  markAllRead: () => api.patch("api/notifications/mark_all_read/"),
  unreadCount: () => api.get("api/notifications/unread_count/")
};

export const messagesApi = {
  list: (params = {}) => api.get("api/messaging/", { params }),
  detail: (id) => api.get(`messaging/${id}/`),
  thread: (userId) => api.get(`messaging/thread/${userId}/`),
  send: (payload) => api.post("api/messaging/", payload),
  markRead: (id) => api.patch(`messaging/${id}/mark_read/`)
};



export const toItems = unwrapList;
