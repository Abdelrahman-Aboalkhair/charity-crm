// logs/logs.service.ts
import { LogsRepository } from "./logs.repository";
import { LogEntry } from "./logs.types";

export class LogsService {
  constructor(private logsRepository: LogsRepository) {}

  async log(entry: LogEntry): Promise<void> {
    // Write to console for development
    console.log(
      `[${entry.level.toUpperCase()}] ${entry.message}`,
      entry.context || ""
    );

    // Write to database
    await this.logsRepository.createLog({
      level: entry.level,
      message: entry.message,
      context: entry.context,
    });
  }

  async info(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: "info", message, context });
  }

  async error(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: "error", message, context });
  }

  async warn(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: "warn", message, context });
  }

  async debug(message: string, context?: Record<string, any>): Promise<void> {
    await this.log({ level: "debug", message, context });
  }
}
