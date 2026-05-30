import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

// Standard message when limit is exceeded
const limitReachedMessage = {
    success: false,
    message: "Too many requests. Please try again later.",
};

const createLimiter = (windowMs, maxRequests) => {
    return rateLimit({
        windowMs,
        max: maxRequests,
        standardHeaders: true,
        legacyHeaders: false,
        message: limitReachedMessage,
        // Fallback to memory store if redis is not ready, otherwise use redis store
        ...(redisClient && redisClient.isReady
            ? {
                  store: new RedisStore({
                      sendCommand: (...args) => redisClient.sendCommand(args),
                  }),
              }
            : {}),
    });
};

export const loginLimiter = createLimiter(15 * 60 * 1000, 10); // 10 requests / 15 minutes
export const registerLimiter = createLimiter(15 * 60 * 1000, 5); // 5 requests / 15 minutes
export const applyJobLimiter = createLimiter(60 * 60 * 1000, 20); // 20 requests / hour
export const postJobLimiter = createLimiter(60 * 60 * 1000, 20); // 20 requests / hour
