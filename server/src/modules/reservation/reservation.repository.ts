import prisma from "@/infra/database/database.config";
import { Reservation, Prisma } from "@prisma/client";

export class ReservationRepository {
  async create(data: any): Promise<Reservation> {
    return prisma.reservation.create({ data });
  }

  async findById(id: string): Promise<Reservation | null> {
    return prisma.reservation.findUnique({
      where: { id },
      include: { donor: true, reserved_by_user: true },
    });
  }

  async findActiveByDonor(donor_id: string): Promise<Reservation | null> {
    return prisma.reservation.findFirst({
      where: {
        donor_id,
        status: "ACTIVE",
        expires_at: { gt: new Date() },
      },
      include: { donor: true, reserved_by_user: true },
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ReservationWhereInput;
    orderBy?: Prisma.ReservationOrderByWithRelationInput;
  }): Promise<Reservation[]> {
    return prisma.reservation.findMany({
      skip: params.skip,
      take: params.take,
      where: params.where,
      orderBy: params.orderBy,
      include: { donor: true, reserved_by_user: true },
    });
  }

  async count(where?: Prisma.ReservationWhereInput): Promise<number> {
    return prisma.reservation.count({ where });
  }

  async update(
    id: string,
    data: Prisma.ReservationUpdateInput
  ): Promise<Reservation> {
    return prisma.reservation.update({
      where: { id },
      data,
      include: { donor: true, reserved_by_user: true },
    });
  }

  async delete(id: string): Promise<Reservation> {
    return prisma.reservation.delete({ where: { id } });
  }
}
