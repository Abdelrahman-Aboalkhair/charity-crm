import { LogsRepository } from "./logs.repository";
import { LogsService } from "./logs.service";

export const makeLogsService = () => {
  const logsRepo = new LogsRepository();
  return new LogsService(logsRepo);
};
