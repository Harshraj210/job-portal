import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

let redisClient;

const initRedis = async () => {
    try {
        const clientOptions = {};

        if (process.env.REDIS_URL) {
            clientOptions.url = process.env.REDIS_URL;
        } else {
            clientOptions.socket = {
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: process.env.REDIS_PORT || 6379,
            };
            if (process.env.REDIS_USERNAME) {
                clientOptions.username = process.env.REDIS_USERNAME;
            }
            if (process.env.REDIS_PASSWORD) {
                clientOptions.password = process.env.REDIS_PASSWORD;
            }
        }

        redisClient = createClient(clientOptions);

        redisClient.on("error", (err) => {
            console.error("REDIS ERROR", err);
        });

        redisClient.on("connect", () => {
            console.log("REDIS CONNECTED");
        });

        redisClient.on("reconnecting", () => {
            console.log("REDIS RECONNECTING");
        });

        redisClient.on("end", () => {
            console.log("REDIS CONNECTION ENDED");
        });

        await redisClient.connect();
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
    }
};

// Graceful shutdown handling
process.on("SIGINT", async () => {
    if (redisClient) {
        await redisClient.quit();
        console.log("Redis disconnected on app termination");
        process.exit(0);
    }
});

export { redisClient, initRedis };
