
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import PublicLayout from "./components/layout/PublicLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import RoleRoute from "./components/common/RoleRoute";
import ErrorBoundary from "./components/common/ErrorBoundary";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Landing from "./pages/public/Landing";
import Jobs from "./pages/jobs/Jobs";
import JobDetails from "./pages/jobs/JobDetails";
import Companies from "./pages/companies/Companies";
import CompanyDetails from "./pages/companies/CompanyDetails";

import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import MyApplications from "./pages/candidate/MyApplications";
import Resumes from "./pages/candidate/Resumes";
import CandidateProfile from "./pages/candidate/CandidateProfile";

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import MyJobs from "./pages/recruiter/MyJobs";
import JobForm from "./pages/recruiter/JobForm";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import CompanyManagement from "./pages/recruiter/CompanyManagement";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";

import Interviews from "./pages/shared/Interviews";
import Notifications from "./pages/shared/Notifications";
import Messages from "./pages/shared/Messages";
import Settings from "./pages/shared/Settings";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardRedirect />} />

            <Route element={<RoleRoute role="CANDIDATE" />}>
              <Route path="/candidate/applications" element={<MyApplications />} />
              <Route path="/candidate/resumes" element={<Resumes />} />
              <Route path="/candidate/profile" element={<CandidateProfile />} />
            </Route>

            <Route element={<RoleRoute role="RECRUITER" />}>
              <Route path="/recruiter/jobs" element={<MyJobs />} />
              <Route path="/recruiter/jobs/new" element={<JobForm />} />
              <Route path="/recruiter/jobs/:id/edit" element={<JobForm />} />
              <Route path="/recruiter/applications" element={<RecruiterApplications />} />
              <Route path="/recruiter/companies" element={<CompanyManagement />} />
              <Route path="/recruiter/profile" element={<RecruiterProfile />} />
            </Route>

            <Route path="/interviews" element={<Interviews />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

function DashboardRedirect() {
  const role = String(localStorage.getItem("hireflow_role") || "").toUpperCase();

  if (role === "RECRUITER") return <RecruiterDashboard />;
  if (role === "CANDIDATE") return <CandidateDashboard />;

  return <Navigate to="/login" replace />;
}
