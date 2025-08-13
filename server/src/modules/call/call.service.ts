import { Call, Prisma } from "@prisma/client";
import { CallRepository } from "./call.repository";
import { DonorRepository } from "../donor/donor.repository";
import AppError from "@/shared/errors/AppError";

export class CallService {
  constructor(
    private callRepository: CallRepository,
    private donorRepository: DonorRepository
  ) {}

  async logCall(data: any, userId?: string): Promise<Call> {
    const donor = await this.donorRepository.findById(data.donor_id);
    if (!donor) throw new AppError(404, "Donor not found");

    const callData = {
      ...data,
      called_by_user_id: userId,
      call_date: new Date(data.call_date),
    };

    return this.callRepository.create(callData);
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
    const where: Prisma.CallWhereInput = {};

    if (donorId) where.donor_id = donorId;
    if (userId) where.called_by_user_id = userId;

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
