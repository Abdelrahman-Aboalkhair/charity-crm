import { Donor, Prisma } from "@prisma/client";
import { DonorRepository } from "./donor.repository";
import AppError from "@/shared/errors/AppError";

export class DonorService {
  private donorRepository: DonorRepository;

  constructor() {
    this.donorRepository = new DonorRepository();
  }

  async createDonor(data: Prisma.DonorCreateInput): Promise<Donor> {
    if (data.email) {
      const existing = await this.donorRepository.findByEmail(data.email);
      if (existing) throw new AppError(400, "Email already exists");
    }
    return this.donorRepository.create(data);
  }

  async getDonorById(id: string): Promise<Donor> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) throw new AppError(404, "Donor not found");
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
            { email: { contains: search, mode: "insensitive" } },
            { phone_number1: { contains: search, mode: "insensitive" } },
            { phone_number2: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [donors, total] = await Promise.all([
      this.donorRepository.findMany({ skip, take: limit, where }),
      this.donorRepository.count(where),
    ]);

    return { donors, total };
  }

  async updateDonor(id: string, data: Prisma.DonorUpdateInput): Promise<Donor> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) throw new AppError(404, "Donor not found");

    if (data.email) {
      const existing = await this.donorRepository.findByEmail(
        data.email as string
      );
      if (existing && existing.id !== id)
        throw new AppError(400, "Email already exists");
    }

    return this.donorRepository.update(id, data);
  }

  async deleteDonor(id: string): Promise<void> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) throw new AppError(404, "Donor not found");
    await this.donorRepository.delete(id);
  }
}
