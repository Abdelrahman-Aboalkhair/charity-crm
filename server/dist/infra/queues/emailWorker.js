"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const logger_1 = __importDefault(require("@/infra/winston/logger"));
const sendEmail_1 = __importDefault(require("@/shared/utils/sendEmail"));
const redis_1 = __importDefault(require("@/infra/cache/redis"));
const emailWorker = new bullmq_1.Worker("emailQueue", (job) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Starting to process email job ${job.id}`);
    console.log("Job data:", job.data);
    if (job.name === "sendVerificationEmail") {
        const { to, subject, text, html } = job.data;
        try {
            const result = yield (0, sendEmail_1.default)({
                to,
                subject,
                text,
                html,
            });
            logger_1.default.info(`Email sent successfully to ${to}`);
        }
        catch (error) {
            logger_1.default.error(`Failed to send email: ${error.message}`);
            throw error;
        }
    }
    // Return something if job.name isn't matched (TypeScript requires a return value)
    throw new Error(`Unknown job name: ${job.name}`);
}), { connection: redis_1.default });
// Event listeners with proper typing
emailWorker.on("failed", (job, err) => {
    logger_1.default.error(`Job ${job === null || job === void 0 ? void 0 : job.id} failed with error: ${err.message}`);
    console.error("Job failure details:", err);
});
emailWorker.on("completed", (job) => {
    logger_1.default.info(`Job ${job.id} completed successfully`);
});
emailWorker.on("error", (err) => {
    logger_1.default.error("Worker error:", err);
});
// Graceful shutdown
process.on("SIGTERM", () => __awaiter(void 0, void 0, void 0, function* () {
    yield emailWorker.close();
}));
exports.default = emailWorker;
