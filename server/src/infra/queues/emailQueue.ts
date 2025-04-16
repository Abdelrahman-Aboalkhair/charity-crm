import { Queue } from "bullmq";
import redisConfig from "../cache/redis";

interface RedisConfig {
  [key: string]: any;
}

const emailQueue = new Queue("emailQueue", {
  connection: redisConfig as RedisConfig,
});

export default emailQueue;
