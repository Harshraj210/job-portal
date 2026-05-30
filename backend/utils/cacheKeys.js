const cacheKeys = {
    // Jobs
    JOBS_ALL: "jobs:all",
    jobSearch: (query) => `jobs:search:${query || 'default'}`,
    jobFilter: (filterHash) => `jobs:filter:${filterHash}`,
    jobDetails: (jobId) => `job:${jobId}`,

    // Dashboards
    dashboardRecruiter: (recruiterId) => `dashboard:recruiter:${recruiterId}`,
    dashboardApplicant: (userId) => `dashboard:applicant:${userId}`,
};

export default cacheKeys;
