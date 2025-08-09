"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redisClient = {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
    },
    client: new ioredis_1.default({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
        retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
        },
        reconnectOnError: (err) => {
            const targetErrors = [/READONLY/, /ETIMEDOUT/];
            return targetErrors.some((regex) => regex.test(err.message));
        },
    }),
};
redisClient.client
    .on("connect", () => console.log("Connected to Redis"))
    .on("error", (err) => console.error("Redis error:", err));
exports.default = redisClient.client;
