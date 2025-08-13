import prisma from "@/infra/database/database.config";
import { Donor, Prisma } from "@prisma/client";

export class DonorRepository {
  async create(data: Prisma.DonorCreateInput): Promise<Donor> {
    return prisma.donor.create({ data });
  }

  async findById(id: string): Promise<Donor | null> {
    return prisma.donor.findUnique({
      where: { id },
      include: {
        donations: true,
        calls: true,
        reservations: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Donor | null> {
    return prisma.donor.findUnique({
      where: { email },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DonorWhereInput;
    orderBy?: Prisma.DonorOrderByWithRelationInput;
  }): Promise<Donor[]> {
    return prisma.donor.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
    });
  }

  async count(where?: Prisma.DonorWhereInput): Promise<number> {
    return prisma.donor.count({ where });
  }

  async update(id: string, data: Prisma.DonorUpdateInput): Promise<Donor> {
    return prisma.donor.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Donor> {
    return prisma.donor.delete({ where: { id } });
  }
}
