"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonorService = void 0;
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const fileParser_1 = require("@/shared/utils/fileParser");
class DonorService {
    constructor(donorRepository, donationRepository) {
        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
    }
    computeDonorStatus(donor) {
        return __awaiter(this, void 0, void 0, function* () {
            if (donor.permanent_deferral) {
                yield this.donorRepository.update(donor.id, { isActive: false });
                return false;
            }
            const activeDeferral = yield this.donorRepository.findMany({
                where: {
                    id: donor.id,
                    deferrals: {
                        some: {
                            status: client_1.DEFERRAL_STATUS.ACTIVE,
                            expected_end_date: { gt: new Date() },
                        },
                    },
                },
            });
            if (activeDeferral.length > 0) {
                yield this.donorRepository.update(donor.id, { isActive: false });
                return false;
            }
            const lastDonation = yield this.donationRepository.findMany({
                where: { donor_id: donor.id, status: client_1.DONATION_STATUS.APPROVED },
                orderBy: { date: "desc" },
                take: 1,
            });
            if (!lastDonation.length) {
                yield this.donorRepository.update(donor.id, { isActive: true });
                return true;
            }
            const lastDonationDate = new Date(lastDonation[0].date);
            const now = new Date();
            const deferralMonths = donor.gender === "MALE" ? 3 : donor.gender === "FEMALE" ? 4 : 3;
            const deferralEndDate = new Date(lastDonationDate);
            deferralEndDate.setMonth(lastDonationDate.getMonth() + deferralMonths);
            const isActive = now >= deferralEndDate;
            yield this.donorRepository.update(donor.id, { isActive });
            return isActive;
        });
    }
    createDonationWithDeferral(donation, userId, deferral) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(donation.donor_id);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            // Check if donor is active
            const isActive = yield this.computeDonorStatus(donor);
            if (!isActive && donation.status !== "REJECTED") {
                throw new AppError_1.default(400, "Donor is currently deferred and cannot donate");
            }
            // Create donation
            const newDonation = yield this.donationRepository.create(Object.assign(Object.assign({}, donation), { created_by_user_id: userId, date: new Date(donation.date) }));
            // Create deferral if provided (e.g., for REJECTED donations)
            if (deferral) {
                yield this.donorRepository.createDeferral({
                    donor_id: donor.id,
                    donation_id: newDonation.id,
                    deferral_type: deferral.deferral_type,
                    start_date: deferral.start_date,
                    expected_end_date: deferral.expected_end_date,
                    notes: deferral.notes,
                    status: "ACTIVE",
                });
            }
            yield this.computeDonorStatus(donor);
            return newDonation;
        });
    }
    createDonor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.email) {
                const existing = yield this.donorRepository.findByEmail(data.email);
                if (existing)
                    throw new AppError_1.default(400, "Email already exists");
            }
            const donor = yield this.donorRepository.create(data);
            yield this.computeDonorStatus(donor);
            return donor;
        });
    }
    bulkImportDonors(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = fileParser_1.FileParser.parseFile(file);
            const errors = [];
            let success = 0;
            for (const [index, row] of data.entries()) {
                try {
                    // Validate required fields
                    if (!row.name) {
                        throw new AppError_1.default(400, "Name is required");
                    }
                    if (!row.gender) {
                        throw new AppError_1.default(400, "Gender is required");
                    }
                    if (!row.email && !row.phone_number1) {
                        throw new AppError_1.default(400, "Email or Phone Number 1 is required");
                    }
                    // Validate gender
                    if (!["MALE", "FEMALE"].includes(row.gender.toUpperCase())) {
                        throw new AppError_1.default(400, "Gender must be MALE or FEMALE");
                    }
                    // Validate DOB format if provided
                    if (row.dob && isNaN(Date.parse(row.dob))) {
                        throw new AppError_1.default(400, "Invalid Date of Birth format. Use YYYY-MM-DD");
                    }
                    // Validate email format if provided
                    if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
                        throw new AppError_1.default(400, "Invalid email format");
                    }
                    const donorData = {
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
                        ? yield this.donorRepository.findByEmail(row.email)
                        : yield this.donorRepository.findMany({
                            where: { phone_number1: row.phone_number1 },
                            take: 1,
                        });
                    if (Array.isArray(existing)) {
                        if (existing.length > 0) {
                            yield this.donorRepository.update(existing[0].id, donorData);
                        }
                    }
                    else if (existing) {
                        yield this.donorRepository.update(existing.id, donorData);
                    }
                    else {
                        yield this.donorRepository.create(donorData);
                    }
                    success++;
                }
                catch (error) {
                    errors.push(`Row ${index + 2}: ${error.message}`); // +2 to account for header row and 1-based indexing for user
                }
            }
            return { success, failed: data.length - success, errors };
        });
    }
    getDonorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(id);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            return donor;
        });
    }
    getDonors(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search, onlyActive } = params;
            const skip = (page - 1) * limit;
            const where = {
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
            const [donors, total] = yield Promise.all([
                this.donorRepository.findMany({ skip, take: limit, where }),
                this.donorRepository.count(where),
            ]);
            yield Promise.all(donors.map((donor) => this.computeDonorStatus(donor)));
            return { donors, total };
        });
    }
    updateDonor(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(id);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            if (data.email) {
                const existing = yield this.donorRepository.findByEmail(data.email);
                if (existing && existing.id !== id)
                    throw new AppError_1.default(400, "Email already exists");
            }
            const updatedDonor = yield this.donorRepository.update(id, data);
            yield this.computeDonorStatus(updatedDonor);
            return updatedDonor;
        });
    }
    deleteDonor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(id);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            yield this.donorRepository.delete(id);
        });
    }
}
exports.DonorService = DonorService;
