/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../contexts/ProfileContext";
import {
  getMyCompany,
  recruiterApplications,
  updateApplicationStatus,
} from "../api/auth";

import TabBar from "../components/recruiter/TabBar";
import OverviewTab from "../components/recruiter/OverviewTab";
import CompanyProfileTab from "../components/recruiter/CompanyProfileTab";
import JobsTab from "../components/recruiter/JobsTab";
import ApplicationsTab from "../components/recruiter/ApplicationsTab";
import RecruiterProfileTab from "../components/recruiter/RecruiterProfileTab";
import RoleGateBanner from "../components/recruiter/RoleGateBanner";
import Toast from "../components/recruiter/Toast";
import { useToast } from "../components/recruiter/useToast";

const TAB_IDS = {
  OVERVIEW: "overview",
  COMPANY: "company",
  JOBS: "jobs",
  APPLICATIONS: "applications",
  PROFILE: "profile",
};

const TAB_DEFS = [
  { id: TAB_IDS.OVERVIEW, label: "Overview" },
  { id: TAB_IDS.COMPANY, label: "Company Profile" },
  { id: TAB_IDS.JOBS, label: "Roles" },
  { id: TAB_IDS.APPLICATIONS, label: "Applications" },
  { id: TAB_IDS.PROFILE, label: "My Profile" },
];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast, showToast, dismiss } = useToast();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(TAB_IDS.OVERVIEW);

  // Company state
  const [company, setCompany] = useState(null);
  const [companyRefreshKey, setCompanyRefreshKey] = useState(0);

  // Jobs state — refreshKey bumps when a job is created/updated/deleted so
  // the JobsTab re-fetches. Also bumps the company doc so open_roles_count
  // stays in sync with what's shown.
  const [jobsRefreshKey, setJobsRefreshKey] = useState(0);

  // If we returned from the JobEditor (it passes a `refreshJobs` timestamp),
  // re-fetch both jobs and the company doc so the new role surfaces immediately.
  useEffect(() => {
    const ts = location.state?.refreshJobs;
    if (!ts) return;
    setJobsRefreshKey(ts);
    setCompanyRefreshKey((k) => k + 1);
    setActiveTab(TAB_IDS.JOBS);
    // Clear the router state so re-mounts don't re-trigger.
    window.history.replaceState({}, "");
  }, [location.state]);

  // When the user is on the dashboard but isn't actually a recruiter (role=None
  // from a legacy signup), every gated call returns 403. Detect this and surface
  // a single banner at the top of every tab so they can self-recover.
  const [needsRecruiterRole, setNeedsRecruiterRole] = useState(false);
  const [roleErrorDetail, setRoleErrorDetail] = useState(null);

  const markRecruiterGateFailed = useCallback((detail) => {
    setNeedsRecruiterRole(true);
    if (detail) setRoleErrorDetail(detail);
  }, []);

  const clearRecruiterGate = useCallback(() => {
    setNeedsRecruiterRole(false);
    setRoleErrorDetail(null);
  }, []);

  // Applications state
  const [applications, setApplications] = useState([]);
  const [applicationsTotal, setApplicationsTotal] = useState(0);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [applicationsError, setApplicationsError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  // Load company once
  useEffect(() => {
    let cancelled = false;
    setNeedsRecruiterRole(false);
    setRoleErrorDetail(null);
    getMyCompany()
      .then((res) => {
        if (cancelled) return;
        const data = res?.data;
        if (data && data.uid) setCompany(data);
        else setCompany(null);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 404) {
          setCompany(null);
        } else if (status === 403) {
          markRecruiterGateFailed(
            err?.response?.data?.detail || "Recruiter role required."
          );
          setCompany(null);
        } else {
          showToast(
            "error",
            err?.response?.data?.detail || "Failed to load company profile."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [companyRefreshKey, showToast, markRecruiterGateFailed]);

  // Load applications on mount and on filter change
  const fetchApplications = useCallback(
    async (statusFilter) => {
      setApplicationsLoading(true);
      setApplicationsError(null);
      try {
        const params = statusFilter && statusFilter !== "all" ? { status: statusFilter } : {};
        const res = await recruiterApplications(params);
        const items = res.data?.items || [];
        setApplications(items);
        setApplicationsTotal(res.data?.total ?? items.length);
      } catch (err) {
        setApplicationsError(
          err?.response?.data?.detail || "Failed to load applications."
        );
        setApplications([]);
        setApplicationsTotal(0);
      } finally {
        setApplicationsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchApplications(filter);
  }, [filter, fetchApplications]);

  // Compute status counts from current applications page.
  // Because the API only returns the current filter's items, we need to fetch
  // each status to compute accurate counts for the overview. We'll do this
  // once on mount and cache the result.
  const [statusCounts, setStatusCounts] = useState({
    submitted: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0,
  });
  const [countsLoading, setCountsLoading] = useState(true);

  const refreshStatusCounts = useCallback(async () => {
    setCountsLoading(true);
    try {
      const responses = await Promise.all([
        recruiterApplications({ status: "submitted", limit: 1 }),
        recruiterApplications({ status: "reviewing", limit: 1 }),
        recruiterApplications({ status: "accepted", limit: 1 }),
        recruiterApplications({ status: "rejected", limit: 1 }),
      ]);
      setStatusCounts({
        submitted: responses[0]?.data?.total ?? 0,
        reviewing: responses[1]?.data?.total ?? 0,
        accepted: responses[2]?.data?.total ?? 0,
        rejected: responses[3]?.data?.total ?? 0,
      });
    } catch {
      // Non-fatal — counts remain zero
    } finally {
      setCountsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStatusCounts();
  }, [refreshStatusCounts]);

  const totalApplications = useMemo(
    () =>
      statusCounts.submitted +
      statusCounts.reviewing +
      statusCounts.accepted +
      statusCounts.rejected,
    [statusCounts]
  );

  const handleStatusChange = useCallback(
    async (appId, newStatus) => {
      setUpdatingId(appId);
      // Optimistic update
      const previous = applications;
      const optimistic = applications.map((a) =>
        (a.id || a.uid) === appId ? { ...a, status: newStatus } : a
      );
      setApplications(optimistic);
      try {
        await updateApplicationStatus(appId, newStatus);
        showToast("success", `Application moved to ${newStatus}.`);
        // Refresh counts and the current list
        refreshStatusCounts();
        fetchApplications(filter);
      } catch (err) {
        setApplications(previous);
        showToast(
          "error",
          err?.response?.data?.detail || "Failed to update status."
        );
      } finally {
        setUpdatingId(null);
      }
    },
    [applications, filter, fetchApplications, refreshStatusCounts, showToast]
  );

  const handleCompanyChange = useCallback(() => {
    setCompanyRefreshKey((k) => k + 1);
  }, []);

  const handleJobsChange = useCallback(() => {
    setJobsRefreshKey((k) => k + 1);
    // The backend recomputes open_roles_count on the company doc; refresh it.
    setCompanyRefreshKey((k) => k + 1);
  }, []);

  const tabs = useMemo(() => {
    return TAB_DEFS.map((t) => {
      if (t.id === TAB_IDS.APPLICATIONS) {
        return { ...t, count: totalApplications };
      }
      if (t.id === TAB_IDS.JOBS) {
        return { ...t, count: company?.open_roles_count ?? 0 };
      }
      return t;
    });
  }, [totalApplications, company?.open_roles_count]);

  const displayName = user?.displayName || user?.name || "";

  const handleRecovered = useCallback(async () => {
    showToast?.("success", "Switched to recruiter mode.");
    clearRecruiterGate();
    // Force-refetch everything so the dashboard reflects the new role.
    setCompanyRefreshKey((k) => k + 1);
    setJobsRefreshKey((k) => k + 1);
    refreshStatusCounts();
    fetchApplications(filter);
  }, [
    clearRecruiterGate,
    showToast,
    refreshStatusCounts,
    fetchApplications,
    filter,
  ]);

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {needsRecruiterRole && (
        <RoleGateBanner detail={roleErrorDetail} onRecovered={handleRecovered} />
      )}

      {activeTab === TAB_IDS.OVERVIEW && (
        <OverviewTab
          displayName={displayName}
          email={user?.email}
          profile={profile}
          company={company}
          statusCounts={statusCounts}
          totalApplications={totalApplications}
          recentApplications={applications}
          loading={countsLoading || applicationsLoading}
          onNavigate={(tabId) => {
            if (tabId === "applications") setActiveTab(TAB_IDS.APPLICATIONS);
            if (tabId === "company") setActiveTab(TAB_IDS.COMPANY);
            if (tabId === "profile") setActiveTab(TAB_IDS.PROFILE);
            if (tabId === "jobs") setActiveTab(TAB_IDS.JOBS);
          }}
        />
      )}

      {activeTab === TAB_IDS.COMPANY && (
        <CompanyProfileTab
          showToast={showToast}
          refreshKey={companyRefreshKey}
          onCompanySaved={() => {
            handleCompanyChange();
          }}
        />
      )}

      {activeTab === TAB_IDS.JOBS && (
        <JobsTab
          showToast={showToast}
          refreshKey={jobsRefreshKey}
          hasCompany={company !== null}
          onJobsChanged={handleJobsChange}
          onCreateCompany={() => setActiveTab(TAB_IDS.COMPANY)}
        />
      )}

      {activeTab === TAB_IDS.APPLICATIONS && (
        <ApplicationsTab
          applications={applications}
          loading={applicationsLoading}
          error={applicationsError}
          filter={filter}
          total={applicationsTotal}
          onFilterChange={setFilter}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
          onRefresh={() => {
            fetchApplications(filter);
            refreshStatusCounts();
          }}
        />
      )}

      {activeTab === TAB_IDS.PROFILE && (
        <RecruiterProfileTab user={user} showToast={showToast} />
      )}

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  );
}
