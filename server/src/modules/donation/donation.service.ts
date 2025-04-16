import { Donation, Prisma } from "@prisma/client";
import { DonorRepository } from "../donor/donor.repository";
import { DonationRepository } from "./donation.repository";
import AppError from "@/shared/errors/AppError";
import { DonorService } from "../donor/donor.service";

export class DonationService {
  constructor(
    private donorRepository: DonorRepository,
    private donationRepository: DonationRepository,
    private donorService: DonorService
  ) {}

  async createDonation(
    data: any,
    userId?: string,
    deferral?: {
      deferral_type: string;
      start_date: Date;
      expected_end_date: Date;
      notes?: string;
    }
  ): Promise<Donation> {
    const donor = await this.donorRepository.findById(data.donor_id);
    if (!donor) throw new AppError(404, "Donor not found");

    return this.donorService.createDonationWithDeferral(data, userId, deferral);
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

    const updatedDonation = await this.donationRepository.update(id, data);
    if (data.date || data.status) {
      const donor = await this.donorRepository.findById(donation.donor_id);
      if (donor) await this.donorService.computeDonorStatus(donor);
    }
    return updatedDonation;
  }

  async deleteDonation(id: string): Promise<void> {
    const donation = await this.donationRepository.findById(id);
    if (!donation) throw new AppError(404, "Donation not found");
    await this.donationRepository.delete(id);
  }
}
