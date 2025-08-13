import prisma from "@/infra/database/database.config";
import { Call, Prisma } from "@prisma/client";

export class CallRepository {
  async create(data: Prisma.CallCreateInput): Promise<Call> {
    return prisma.call.create({ data });
  }

  async findById(id: string): Promise<Call | null> {
    return prisma.call.findUnique({
      where: { id },
      include: { donor: true, called_by_user: true },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.CallWhereInput;
    orderBy?: Prisma.CallOrderByWithRelationInput;
  }): Promise<Call[]> {
    return prisma.call.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: { donor: true, called_by_user: true },
    });
  }

  async count(where?: Prisma.CallWhereInput): Promise<number> {
    return prisma.call.count({ where });
  }

  async update(id: string, data: Prisma.CallUpdateInput): Promise<Call> {
    return prisma.call.update({
      where: { id },
      data,
      include: { donor: true, called_by_user: true },
    });
  }

  async delete(id: string): Promise<Call> {
    return prisma.call.delete({ where: { id } });
  }
}
