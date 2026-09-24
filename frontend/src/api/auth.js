// src/api/auth.js
const normalizeUser = (u) => u && ({
  ...u,
  candidateProfile: u.candidate_profile ?? null,
  recruiterProfile: u.recruiter_profile ?? null,
});

export const authApi = {
  me: () => api.get('/auth/me/').then(r => normalizeUser(r.data)),
  // ...apply normalizeUser to register/login responses too
};