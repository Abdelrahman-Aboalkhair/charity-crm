import Redis from "ioredis";

interface RedisConnectionConfig {
  host: string;
  port: number | string;
}

interface BackoffConfig {
  type: "exponential" | "fixed";
  delay: number;
}

interface DefaultJobOptions {
  attempts: number;
  backoff: BackoffConfig;
}

interface RedisConfig {
  connection: RedisConnectionConfig;
  defaultJobOptions: DefaultJobOptions;
  client: Redis;
}

const redisClient: RedisConfig = {
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
  client: new Redis({
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

export default redisClient.client;
