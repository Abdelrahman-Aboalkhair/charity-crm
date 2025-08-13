import { Donor, Prisma } from "@prisma/client";
import { DonorRepository } from "./donor.repository";
import AppError from "@/shared/errors/AppError";

export class DonorService {
  constructor(private donorRepository: DonorRepository) {}

  async createDonor(data: Prisma.DonorCreateInput): Promise<Donor> {
    if (data.email) {
      const existingDonor = await this.donorRepository.findByEmail(data.email);
      if (existingDonor) {
        throw new AppError(400, "Donor with this email already exists");
      }
    }

    return this.donorRepository.create(data);
  }

  async getDonorById(id: string): Promise<Donor> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) {
      throw new AppError(404, "Donor not found");
    }
    return donor;
  }

  async getDonors(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<{ donors: Donor[]; total: number }> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.DonorWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone_number1: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [donors, total] = await Promise.all([
      this.donorRepository.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: "desc" },
      }),
      this.donorRepository.count(where),
    ]);

    return { donors, total };
  }

  async updateDonor(id: string, data: Prisma.DonorUpdateInput): Promise<Donor> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) {
      throw new AppError(404, "Donor not found");
    }

    return this.donorRepository.update(id, data);
  }

  async deleteDonor(id: string): Promise<void> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) {
      throw new AppError(404, "Donor not found");
    }

    await this.donorRepository.delete(id);
  }

  async bulkImportDonors(
    file: Express.Multer.File
  ): Promise<{ message: string; count: number }> {
    // Simple bulk import - can be enhanced later
    return {
      message: "Bulk import feature coming soon",
      count: 0,
    };
  }
}
