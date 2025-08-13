import { Donation, Prisma } from "@prisma/client";
import { DonorRepository } from "../donor/donor.repository";
import { DonationRepository } from "./donation.repository";
import AppError from "@/shared/errors/AppError";

export class DonationService {
  constructor(
    private donorRepository: DonorRepository,
    private donationRepository: DonationRepository
  ) {}

  async createDonation(data: any, userId?: string): Promise<Donation> {
    const donor = await this.donorRepository.findById(data.donor_id);
    if (!donor) throw new AppError(404, "Donor not found");

    return this.donationRepository.create({
      ...data,
      created_by_user_id: userId,
      date: new Date(data.date),
    });
  }

  async getDonationById(id: string): Promise<Donation> {
    const donation = await this.donationRepository.findById(id);
    if (!donation) throw new AppError(404, "Donation not found");
    return donation;
  }

  async getDonations(params: {
    page: number;
    limit: number;
    donorId?: string;
  }): Promise<{ donations: Donation[]; total: number }> {
    const { page, limit, donorId } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.DonationWhereInput = donorId
      ? { donor_id: donorId }
      : {};

    const [donations, total] = await Promise.all([
      this.donationRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { date: "desc" },
      }),
      this.donationRepository.count(where),
    ]);

    return { donations, total };
  }

  async updateDonation(
    id: string,
    data: Prisma.DonationUpdateInput
  ): Promise<Donation> {
    const donation = await this.donationRepository.findById(id);
    if (!donation) throw new AppError(404, "Donation not found");

    return this.donationRepository.update(id, data);
  }

  async deleteDonation(id: string): Promise<void> {
    const donation = await this.donationRepository.findById(id);
    if (!donation) throw new AppError(404, "Donation not found");
    await this.donationRepository.delete(id);
  }
}
