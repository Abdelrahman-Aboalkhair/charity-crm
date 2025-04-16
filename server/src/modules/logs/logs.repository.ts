import { PrismaClient } from "@prisma/client";
import { LogEntry } from "./logs.types";

export class LogsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createLog(data: LogEntry) {
    return this.prisma.log.create({
      data: {
        level: data.level,
        message: data.message,
        context: data.context,
      },
    });
  }
}
