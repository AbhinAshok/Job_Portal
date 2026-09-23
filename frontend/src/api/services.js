import { api, unwrapList } from "./client";

export const authApi = {
  register: (payload) => api.post("auth/register/", payload),
  login: (payload) => api.post("auth/login/", payload),
  logout: (refresh) => api.post("auth/logout/", { refresh }),
  me: () => api.get("auth/me/"),
  updateMe: (payload) => api.patch("auth/me/", payload),
  changePassword: (payload) => api.post("auth/password/change/", payload),
  forgotPassword: (email) => api.post("auth/password/reset/", { email }),
  resetPassword: (payload) => api.post("auth/password/reset/confirm/", payload),
  candidateProfile: () => api.get("auth/profile/candidate/"),
  updateCandidateProfile: (form) => api.patch("auth/profile/candidate/", form),
  // recruiterProfile: () => api.get("api/auth/profile/recruiter/"),
  // updateRecruiterProfile: (payload) => api.patch("api/auth/profile/recruiter/", payload)
  updateRecruiterProfile: (payload) => api.patch("auth/me/", payload)
};

export const companiesApi = {
  list: (params = {}) => api.get("companies/", { params }),
  detail: (id) => api.get(`companies/${id}/`),
  create: (form) => api.post("companies/", form),
  update: (id, form) => api.patch(`companies/${id}/`, form),
  remove: (id) => api.delete(`companies/${id}/`),
  mine: (params = {}) => api.get("companies/mine/", { params })
};

export const jobsApi = {
  list: (params = {}) => api.get("jobs/", { params }),
  detail: (id) => api.get(`jobs/${id}/`),
  create: (payload) => api.post("jobs/", payload),
  update: (id, payload) => api.patch(`jobs/${id}/`, payload),
  remove: (id) => api.delete(`jobs/${id}/`),
  mine: (params = {}) => api.get("jobs/my_jobs/", { params })
};

export const applicationsApi = {
  list: (params = {}) => api.get("applications/", { params }),
  detail: (id) => api.get(`applications/${id}/`),
  create: (form) => api.post("applications/", form),
  updateStatus: (id, status) => api.patch(`applications/${id}/update_status/`, { status })
};

export const resumesApi = {
  list: (params = {}) => api.get("resumes/", { params }),
  detail: (id) => api.get(`resumes/${id}/`),
  create: (form) => api.post("resumes/", form),
  update: (id, form) => api.patch(`resumes/${id}/`, form),
  remove: (id) => api.delete(`resumes/${id}/`),
  setDefault: (id) => api.post(`resumes/${id}/set_default/`)
};

export const interviewsApi = {
  list: (params = {}) => api.get("interviews/", { params }),
  detail: (id) => api.get(`interviews/${id}/`),
  upcoming: () => api.get("interviews/upcoming/"),
  create: (payload) => api.post("interviews/", payload),
  update: (id, payload) => api.patch(`interviews/${id}/`, payload),
  remove: (id) => api.delete(`ainterviews/${id}/`),
  updateStatus: (id, status) => api.patch(`interviews/${id}/update_status/`, { status })
};

export const notificationsApi = {
  list: (params = {}) => api.get("notifications/", { params }),
  detail: (id) => api.get(`notifications/${id}/`),
  remove: (id) => api.delete(`notifications/${id}/`),
  markRead: (id) => api.patch(`notifications/${id}/mark_as_read/`),
  markAllRead: () => api.patch("notifications/mark_all_read/"),
  unreadCount: () => api.get("notifications/unread_count/")
};

export const messagesApi = {
  list: (params = {}) => api.get("messaging/", { params }),
  detail: (id) => api.get(`messaging/${id}/`),
  thread: (userId) => api.get(`messaging/thread/${userId}/`),
  send: (payload) => api.post("messaging/", payload),
  markRead: (id) => api.patch(`messaging/${id}/mark_read/`)
};



export const toItems = unwrapList;
