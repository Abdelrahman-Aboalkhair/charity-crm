import prisma from "@/infra/database/database.config";
import { Location, Prisma } from "@prisma/client";

export class LocationRepository {
  async create(data: Prisma.LocationCreateInput): Promise<Location> {
    return prisma.location.create({ data });
  }

  async findById(id: string): Promise<Location | null> {
    return prisma.location.findUnique({
      where: { id },
      include: { donors: true, donations: true },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.LocationWhereInput;
    orderBy?: Prisma.LocationOrderByWithRelationInput;
  }): Promise<Location[]> {
    return prisma.location.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: { donors: true, donations: true },
    });
  }

  async count(where?: Prisma.LocationWhereInput): Promise<number> {
    return prisma.location.count({ where });
  }

  async update(
    id: string,
    data: Prisma.LocationUpdateInput
  ): Promise<Location> {
    return prisma.location.update({
      where: { id },
      data,
      include: { donors: true, donations: true },
    });
  }

  async delete(id: string): Promise<Location> {
    return prisma.location.delete({ where: { id } });
  }
}
