import { Worker, Job } from "bullmq";
import logger from "@/infra/winston/logger";
import sendEmail from "@/shared/utils/sendEmail";
import redisConfig from "@/infra/cache/redis";

interface EmailJobData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

interface EmailResult {
  [key: string]: any;
}

interface RedisConfig {
  [key: string]: any;
}

const emailWorker = new Worker<EmailJobData>(
  "emailQueue",
  async (job: Job<EmailJobData>): Promise<EmailResult> => {
    logger.info(`Starting to process email job ${job.id}`);
    console.log("Job data:", job.data);

    if (job.name === "sendVerificationEmail") {
      const { to, subject, text, html } = job.data;

      try {
        const result = await sendEmail({
          to,
          subject,
          text,
          html,
        });

        logger.info(`Email sent successfully to ${to}`);
      } catch (error) {
        logger.error(`Failed to send email: ${(error as Error).message}`);
        throw error;
      }
    }
    // Return something if job.name isn't matched (TypeScript requires a return value)
    throw new Error(`Unknown job name: ${job.name}`);
  },
  { connection: redisConfig as RedisConfig }
);

// Event listeners with proper typing
emailWorker.on("failed", (job: Job<EmailJobData> | undefined, err: Error) => {
  logger.error(`Job ${job?.id} failed with error: ${err.message}`);
  console.error("Job failure details:", err);
});

emailWorker.on("completed", (job: Job<EmailJobData>) => {
  logger.info(`Job ${job.id} completed successfully`);
});

emailWorker.on("error", (err: Error) => {
  logger.error("Worker error:", err);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  await emailWorker.close();
});

export default emailWorker;
