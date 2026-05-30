import { redisClient } from "../config/redis.js";

/**
 * Get data from cache
 * @param {string} key Redis key
 * @returns {Promise<any|null>} Parsed JSON data or null
 */
const getCache = async (key) => {
    if (!redisClient || !redisClient.isReady) return null;
    try {
        const data = await redisClient.get(key);
        if (data) {
            console.log(`CACHE HIT: ${key}`);
            return JSON.parse(data);
        }
        console.log(`CACHE MISS: ${key}`);
        return null;
    } catch (error) {
        console.error(`Error getting cache for key ${key}:`, error);
        return null;
    }
};

/**
 * Set data to cache
 * @param {string} key Redis key
 * @param {any} value Data to cache
 * @param {number} ttl Time to live in seconds
 */
const setCache = async (key, value, ttl = 300) => {
    if (!redisClient || !redisClient.isReady) return;
    try {
        const stringValue = JSON.stringify(value);
        await redisClient.setEx(key, ttl, stringValue);
    } catch (error) {
        console.error(`Error setting cache for key ${key}:`, error);
    }
};

/**
 * Delete a specific key from cache
 * @param {string} key Redis key
 */
const deleteCache = async (key) => {
    if (!redisClient || !redisClient.isReady) return;
    try {
        await redisClient.del(key);
        console.log(`CACHE INVALIDATED: ${key}`);
    } catch (error) {
        console.error(`Error deleting cache for key ${key}:`, error);
    }
};

/**
 * Delete keys matching a pattern (e.g., 'jobs:*')
 * @param {string} pattern Redis pattern
 */
const deletePattern = async (pattern) => {
    if (!redisClient || !redisClient.isReady) return;
    try {
        // Use SCAN for non-blocking pattern matching
        let cursor = 0;
        let keysToDelete = [];
        do {
            const result = await redisClient.scan(cursor, { MATCH: pattern, COUNT: 100 });
            cursor = result.cursor;
            keysToDelete.push(...result.keys);
        } while (cursor !== 0);

        if (keysToDelete.length > 0) {
            await redisClient.del(keysToDelete);
            console.log(`CACHE INVALIDATED (Pattern ${pattern}): ${keysToDelete.join(', ')}`);
        }
    } catch (error) {
        console.error(`Error deleting cache pattern ${pattern}:`, error);
    }
};

export default {
    getCache,
    setCache,
    deleteCache,
    deletePattern
};
