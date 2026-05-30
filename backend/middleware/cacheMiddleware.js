import cacheService from "../services/cacheService.js";

/**
 * Middleware to intercept GET requests and return cached data if available.
 * @param {function} keyGenerator Function to generate cache key based on req
 * @param {number} ttl TTL in seconds
 */
const cacheMiddleware = (keyGenerator, ttl = 300) => {
    return async (req, res, next) => {
        try {
            const key = keyGenerator(req);
            const cachedData = await cacheService.getCache(key);

            if (cachedData) {
                return res.status(200).json(cachedData);
            }

            // Patch res.json to cache the response before sending it
            const originalJson = res.json;
            res.json = function (data) {
                // Only cache successful GET responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    cacheService.setCache(key, data, ttl);
                }
                originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error("Cache middleware error:", error);
            // Proceed to the actual route handler if cache fails
            next();
        }
    };
};

export default cacheMiddleware;
