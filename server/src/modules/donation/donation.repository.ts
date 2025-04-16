import prisma from "@/infra/database/database.config";
import { Donation, Prisma } from "@prisma/client";

export class DonationRepository {
  async create(data: Prisma.DonationCreateInput): Promise<Donation> {
    return prisma.donation.create({ data });
  }

  async findById(id: string): Promise<Donation | null> {
    return prisma.donation.findUnique({
      where: { id },
      include: {
        donor: true,
        location: true,
        created_by_user: true,
        deferral: true,
      },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DonationWhereInput;
    orderBy?: Prisma.DonationOrderByWithRelationInput;
  }): Promise<Donation[]> {
    return prisma.donation.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: { donor: true, location: true, created_by_user: true },
    });
  }

  async count(where?: Prisma.DonationWhereInput): Promise<number> {
    return prisma.donation.count({ where });
  }

  async update(
    id: string,
    data: Prisma.DonationUpdateInput
  ): Promise<Donation> {
    return prisma.donation.update({
      where: { id },
      data,
      include: { donor: true, location: true, created_by_user: true },
    });
  }

  async delete(id: string): Promise<Donation> {
    return prisma.donation.delete({ where: { id } });
  }
}
