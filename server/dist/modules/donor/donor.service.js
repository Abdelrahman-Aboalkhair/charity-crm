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
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class DonorService {
    constructor(donorRepository) {
        this.donorRepository = donorRepository;
    }
    createDonor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.email) {
                const existingDonor = yield this.donorRepository.findByEmail(data.email);
                if (existingDonor) {
                    throw new AppError_1.default(400, "Donor with this email already exists");
                }
            }
            return this.donorRepository.create(data);
        });
    }
    getDonorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(id);
            if (!donor) {
                throw new AppError_1.default(404, "Donor not found");
            }
            return donor;
        });
    }
    getDonors(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, search } = params;
            const skip = (page - 1) * limit;
            const where = search
                ? {
                    OR: [
                        { name: { contains: search, mode: "insensitive" } },
                        { email: { contains: search, mode: "insensitive" } },
                        { phone_number1: { contains: search, mode: "insensitive" } },
                    ],
                }
                : {};
            const [donors, total] = yield Promise.all([
                this.donorRepository.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { createdAt: "desc" },
                }),
                this.donorRepository.count(where),
            ]);
            return { donors, total };
        });
    }
    updateDonor(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(id);
            if (!donor) {
                throw new AppError_1.default(404, "Donor not found");
            }
            return this.donorRepository.update(id, data);
        });
    }
    deleteDonor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(id);
            if (!donor) {
                throw new AppError_1.default(404, "Donor not found");
            }
            yield this.donorRepository.delete(id);
        });
    }
    bulkImportDonors(file) {
        return __awaiter(this, void 0, void 0, function* () {
            // Simple bulk import - can be enhanced later
            return {
                message: "Bulk import feature coming soon",
                count: 0,
            };
        });
    }
}
exports.DonorService = DonorService;
