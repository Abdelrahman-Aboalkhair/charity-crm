import { Reservation, Prisma } from "@prisma/client";
import { ReservationRepository } from "./reservation.repository";
import { DonorRepository } from "../donor/donor.repository";
import AppError from "@/shared/errors/AppError";

export class ReservationService {
  constructor(
    private reservationRepository: ReservationRepository,
    private donorRepository: DonorRepository
  ) {}

  async createReservation(
    donorId: string,
    expiresAt: Date,
    userId?: string
  ): Promise<Reservation> {
    const donor = await this.donorRepository.findById(donorId);
    if (!donor) throw new AppError(404, "Donor not found");

    // Check for active reservations
    const existing = await this.reservationRepository.findActiveByDonor(
      donorId
    );
    if (existing) throw new AppError(400, "Donor is already reserved");

    return this.reservationRepository.create({
      donor_id: donorId,
      reserved_by_user_id: userId,
      expires_at: expiresAt,
    });
  }

  async getReservationById(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) throw new AppError(404, "Reservation not found");
    return reservation;
  }

  async getReservations(params: {
    page: number;
    limit: number;
    donorId?: string;
    userId?: string;
  }): Promise<{ reservations: Reservation[]; total: number }> {
    const { page, limit, donorId, userId } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.ReservationWhereInput = {};

    if (donorId) where.donor_id = donorId;
    if (userId) where.reserved_by_user_id = userId;

    const [reservations, total] = await Promise.all([
      this.reservationRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: "desc" },
      }),
      this.reservationRepository.count(where),
    ]);

    return { reservations, total };
  }

  async updateReservation(
    id: string,
    data: Prisma.ReservationUpdateInput
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) throw new AppError(404, "Reservation not found");
    return this.reservationRepository.update(id, data);
  }

  async deleteReservation(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) throw new AppError(404, "Reservation not found");
    await this.reservationRepository.delete(id);
  }
}
