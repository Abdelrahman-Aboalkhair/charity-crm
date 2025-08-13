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
exports.DonationService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class DonationService {
    constructor(donorRepository, donationRepository) {
        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
    }
    createDonation(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(data.donor_id);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            return this.donationRepository.create(Object.assign(Object.assign({}, data), { created_by_user_id: userId, date: new Date(data.date) }));
        });
    }
    getDonationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const donation = yield this.donationRepository.findById(id);
            if (!donation)
                throw new AppError_1.default(404, "Donation not found");
            return donation;
        });
    }
    getDonations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, donorId } = params;
            const skip = (page - 1) * limit;
            const where = donorId
                ? { donor_id: donorId }
                : {};
            const [donations, total] = yield Promise.all([
                this.donationRepository.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { date: "desc" },
                }),
                this.donationRepository.count(where),
            ]);
            return { donations, total };
        });
    }
    updateDonation(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const donation = yield this.donationRepository.findById(id);
            if (!donation)
                throw new AppError_1.default(404, "Donation not found");
            return this.donationRepository.update(id, data);
        });
    }
    deleteDonation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const donation = yield this.donationRepository.findById(id);
            if (!donation)
                throw new AppError_1.default(404, "Donation not found");
            yield this.donationRepository.delete(id);
        });
    }
}
exports.DonationService = DonationService;
