import { Call, Prisma } from "@prisma/client";
import { CallRepository } from "./call.repository";
import { ReservationRepository } from "../reservation/reservation.repository";
import { DonorRepository } from "../donor/donor.repository";
import AppError from "@/shared/errors/AppError";

export class CallService {
  private callRepository: CallRepository;
  private reservationRepository: ReservationRepository;
  private donorRepository: DonorRepository;

  constructor() {
    this.callRepository = new CallRepository();
    this.reservationRepository = new ReservationRepository();
    this.donorRepository = new DonorRepository();
  }

  async logCall(data: any, userId?: string): Promise<Call> {
    const donor = await this.donorRepository.findById(data.donor_id);
    if (!donor) throw new AppError(404, "Donor not found");

    // Check if there's an active reservation by this user
    const reservation = await this.reservationRepository.findActiveByDonor(
      data.donor_id
    );
    if (reservation && reservation.reserved_by_user_id !== userId) {
      throw new AppError(403, "Donor is reserved by another user");
    }

    const callData = {
      ...data,
      called_by_user_id: userId,
      call_date: new Date(data.call_date),
      reservation_id: reservation?.id,
    };

    const call = await this.callRepository.create(callData);

    // Update reservation status if applicable
    if (reservation) {
      await this.reservationRepository.update(reservation.id, {
        status: "COMPLETED",
      });
    }

    return call;
  }

  async getCallById(id: string): Promise<Call> {
    const call = await this.callRepository.findById(id);
    if (!call) throw new AppError(404, "Call not found");
    return call;
  }

  async getCalls(params: {
    page: number;
    limit: number;
    donorId?: string;
    userId?: string;
  }): Promise<{ calls: Call[]; total: number }> {
    const { page, limit, donorId, userId } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.CallWhereInput = {
      donor_id: donorId,
      called_by_user_id: userId,
    };

    const [calls, total] = await Promise.all([
      this.callRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { call_date: "desc" },
      }),
      this.callRepository.count(where),
    ]);

    return { calls, total };
  }

  async updateCall(id: string, data: Prisma.CallUpdateInput): Promise<Call> {
    const call = await this.callRepository.findById(id);
    if (!call) throw new AppError(404, "Call not found");
    return this.callRepository.update(id, data);
  }

  async deleteCall(id: string): Promise<void> {
    const call = await this.callRepository.findById(id);
    if (!call) throw new AppError(404, "Call not found");
    await this.callRepository.delete(id);
  }
}
