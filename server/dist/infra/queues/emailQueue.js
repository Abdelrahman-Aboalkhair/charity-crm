"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_1 = __importDefault(require("../cache/redis"));
const emailQueue = new bullmq_1.Queue("emailQueue", {
    connection: redis_1.default,
});
exports.default = emailQueue;
