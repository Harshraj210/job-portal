import cacheService from "./cacheService.js";
import cacheKeys from "../utils/cacheKeys.js";

/**
 * Service to handle dashboard cache invalidations specifically.
 */

const invalidateJobCaches = async () => {
    await cacheService.deleteCache(cacheKeys.JOBS_ALL);
    await cacheService.deletePattern("jobs:search:*");
    await cacheService.deletePattern("jobs:filter:*");
};

const invalidateJobDetail = async (jobId) => {
    await cacheService.deleteCache(cacheKeys.jobDetails(jobId));
};

const invalidateRecruiterDashboard = async (recruiterId) => {
    await cacheService.deleteCache(cacheKeys.dashboardRecruiter(recruiterId));
};

const invalidateApplicantDashboard = async (userId) => {
    await cacheService.deleteCache(cacheKeys.dashboardApplicant(userId));
};

export default {
    invalidateJobCaches,
    invalidateJobDetail,
    invalidateRecruiterDashboard,
    invalidateApplicantDashboard
};
