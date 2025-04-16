import {
  DEFERRAL_STATUS,
  DONATION_STATUS,
  Donor,
  Prisma,
} from "@prisma/client";
import { DonorRepository } from "./donor.repository";
import AppError from "@/shared/errors/AppError";
import { DonationRepository } from "../donation/donation.repository";
import { FileParser } from "@/shared/utils/fileParser";

export class DonorService {
  constructor(
    private donorRepository: DonorRepository,
    private donationRepository: DonationRepository
  ) {}

  async computeDonorStatus(donor: Donor): Promise<boolean> {
    if (donor.permanent_deferral) {
      await this.donorRepository.update(donor.id, { isActive: false });
      return false;
    }

    const activeDeferral = await this.donorRepository.findMany({
      where: {
        id: donor.id,
        deferrals: {
          some: {
            status: DEFERRAL_STATUS.ACTIVE,
            expected_end_date: { gt: new Date() },
          },
        },
      },
    });

    if (activeDeferral.length > 0) {
      await this.donorRepository.update(donor.id, { isActive: false });
      return false;
    }

    const lastDonation = await this.donationRepository.findMany({
      where: { donor_id: donor.id, status: DONATION_STATUS.APPROVED },
      orderBy: { date: "desc" },
      take: 1,
    });

    if (!lastDonation.length) {
      await this.donorRepository.update(donor.id, { isActive: true });
      return true;
    }

    const lastDonationDate = new Date(lastDonation[0].date);
    const now = new Date();
    const deferralMonths =
      donor.gender === "MALE" ? 3 : donor.gender === "FEMALE" ? 4 : 3;
    const deferralEndDate = new Date(lastDonationDate);
    deferralEndDate.setMonth(lastDonationDate.getMonth() + deferralMonths);

    const isActive = now >= deferralEndDate;
    await this.donorRepository.update(donor.id, { isActive });
    return isActive;
  }

  async createDonationWithDeferral(
    donation: any,
    userId?: string,
    deferral?: {
      deferral_type: string;
      start_date: Date;
      expected_end_date: Date;
      notes?: string;
    }
  ): Promise<any> {
    const donor = await this.donorRepository.findById(donation.donor_id);
    if (!donor) throw new AppError(404, "Donor not found");

    // Check if donor is active
    const isActive = await this.computeDonorStatus(donor);
    if (!isActive && donation.status !== "REJECTED") {
      throw new AppError(400, "Donor is currently deferred and cannot donate");
    }

    // Create donation
    const newDonation = await this.donationRepository.create({
      ...donation,
      created_by_user_id: userId,
      date: new Date(donation.date),
    });

    // Create deferral if provided (e.g., for REJECTED donations)
    if (deferral) {
      await this.donorRepository.createDeferral({
        donor_id: donor.id,
        donation_id: newDonation.id,
        deferral_type: deferral.deferral_type,
        start_date: deferral.start_date,
        expected_end_date: deferral.expected_end_date,
        notes: deferral.notes,
        status: "ACTIVE",
      });
    }

    await this.computeDonorStatus(donor);
    return newDonation;
  }

  async createDonor(data: Prisma.DonorCreateInput): Promise<Donor> {
    if (data.email) {
      const existing = await this.donorRepository.findByEmail(data.email);
      if (existing) throw new AppError(400, "Email already exists");
    }
    const donor = await this.donorRepository.create(data);
    await this.computeDonorStatus(donor);
    return donor;
  }

  async bulkImportDonors(
    file: Express.Multer.File
  ): Promise<{ success: number; failed: number; errors: string[] }> {
    const data = FileParser.parseFile(file);
    const errors: string[] = [];
    let success = 0;

    for (const [index, row] of data.entries()) {
      try {
        // Validate required fields
        if (!row.name) {
          throw new AppError(400, "Name is required");
        }

        if (!row.gender) {
          throw new AppError(400, "Gender is required");
        }

        if (!row.email && !row.phone_number1) {
          throw new AppError(400, "Email or Phone Number 1 is required");
        }

        // Validate gender
        if (!["MALE", "FEMALE"].includes(row.gender.toUpperCase())) {
          throw new AppError(400, "Gender must be MALE or FEMALE");
        }

        // Validate DOB format if provided
        if (row.dob && isNaN(Date.parse(row.dob))) {
          throw new AppError(
            400,
            "Invalid Date of Birth format. Use YYYY-MM-DD"
          );
        }

        // Validate email format if provided
        if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
          throw new AppError(400, "Invalid email format");
        }

        const donorData: Prisma.DonorCreateInput = {
          name: row.name,
          phone_number1: row.phone_number1,
          network_provider1: row.network_provider1,
          phone_number2: row.phone_number2,
          network_provider2: row.network_provider2,
          dob: row.dob ? new Date(row.dob) : undefined,
          email: row.email,
          job_title: row.job_title,
          job_details: row.job_details,
          province: row.province,
          city: row.city,
          area: row.area,
          donor_conditions: row.donor_conditions,
          ready_to_volunteer: row.ready_to_volunteer || false,
          permanent_deferral: row.permanent_deferral || false,
          gender: row.gender,
        };

        // Upsert donor by email or phone_number1
        const existing = row.email
          ? await this.donorRepository.findByEmail(row.email)
          : await this.donorRepository.findMany({
              where: { phone_number1: row.phone_number1 },
              take: 1,
            });

        if (Array.isArray(existing)) {
          if (existing.length > 0) {
            await this.donorRepository.update(existing[0].id, donorData);
          }
        } else if (existing) {
          await this.donorRepository.update(existing.id, donorData);
        } else {
          await this.donorRepository.create(donorData);
        }

        success++;
      } catch (error: any) {
        errors.push(`Row ${index + 2}: ${error.message}`); // +2 to account for header row and 1-based indexing for user
      }
    }

    return { success, failed: data.length - success, errors };
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
    onlyActive?: boolean;
  }): Promise<{ donors: Donor[]; total: number }> {
    const { page, limit, search, onlyActive } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.DonorWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { email: { contains: search, mode: "insensitive" } },
                { phone_number1: { contains: search, mode: "insensitive" } },
                { phone_number2: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        onlyActive ? { isActive: true } : {},
      ],
    };

    const [donors, total] = await Promise.all([
      this.donorRepository.findMany({ skip, take: limit, where }),
      this.donorRepository.count(where),
    ]);

    await Promise.all(donors.map((donor) => this.computeDonorStatus(donor)));

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

    const updatedDonor = await this.donorRepository.update(id, data);
    await this.computeDonorStatus(updatedDonor);
    return updatedDonor;
  }

  async deleteDonor(id: string): Promise<void> {
    const donor = await this.donorRepository.findById(id);
    if (!donor) throw new AppError(404, "Donor not found");
    await this.donorRepository.delete(id);
  }
}
