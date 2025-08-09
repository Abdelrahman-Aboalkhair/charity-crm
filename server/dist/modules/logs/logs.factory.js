"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLogsService = void 0;
const logs_repository_1 = require("./logs.repository");
const logs_service_1 = require("./logs.service");
const makeLogsService = () => {
    const logsRepo = new logs_repository_1.LogsRepository();
    return new logs_service_1.LogsService(logsRepo);
};
exports.makeLogsService = makeLogsService;
