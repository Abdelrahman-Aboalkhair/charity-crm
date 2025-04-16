import prisma from "@/infra/database/database.config";
import { Donor, Prisma } from "@prisma/client";

export class DonorRepository {
  async create(data: Prisma.DonorCreateInput): Promise<Donor> {
    return prisma.donor.create({ data });
  }

  async createDeferral(data: any): Promise<any> {
    return prisma.donorDeferral.create({
      data,
    });
  }

  async findById(id: string): Promise<Donor | null> {
    return prisma.donor.findUnique({
      where: { id },
      include: {
        location: true,
        donations: true,
        deferrals: true,
        calls: true,
        reservations: true,
      },
    });
  }

  async findByEmail(email: string): Promise<Donor | null> {
    return prisma.donor.findUnique({
      where: { email },
      include: { location: true },
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
      include: { location: true, deferrals: true },
    });
  }

  async count(where?: Prisma.DonorWhereInput): Promise<number> {
    return prisma.donor.count({ where });
  }

  async update(id: string, data: Prisma.DonorUpdateInput): Promise<Donor> {
    return prisma.donor.update({
      where: { id },
      data,
      include: { location: true },
    });
  }

  async delete(id: string): Promise<Donor> {
    return prisma.donor.delete({ where: { id } });
  }
}
