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
exports.ReservationService = void 0;
const reservation_repository_1 = require("./reservation.repository");
const donor_repository_1 = require("../donor/donor.repository");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class ReservationService {
    constructor() {
        this.reservationRepository = new reservation_repository_1.ReservationRepository();
        this.donorRepository = new donor_repository_1.DonorRepository();
    }
    createReservation(donorId, expiresAt, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(donorId);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            // Check for active reservations
            const existing = yield this.reservationRepository.findActiveByDonor(donorId);
            if (existing)
                throw new AppError_1.default(400, "Donor is already reserved");
            return this.reservationRepository.create({
                donor_id: donorId,
                reserved_by_user_id: userId,
                expires_at: expiresAt,
            });
        });
    }
    getReservationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.reservationRepository.findById(id);
            if (!reservation)
                throw new AppError_1.default(404, "Reservation not found");
            return reservation;
        });
    }
    getReservations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, donorId, userId } = params;
            const skip = (page - 1) * limit;
            const where = {
                donor_id: donorId,
                reserved_by_user_id: userId,
            };
            const [reservations, total] = yield Promise.all([
                this.reservationRepository.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { createdAt: "desc" },
                }),
                this.reservationRepository.count(where),
            ]);
            return { reservations, total };
        });
    }
    updateReservation(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.reservationRepository.findById(id);
            if (!reservation)
                throw new AppError_1.default(404, "Reservation not found");
            return this.reservationRepository.update(id, data);
        });
    }
    deleteReservation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const reservation = yield this.reservationRepository.findById(id);
            if (!reservation)
                throw new AppError_1.default(404, "Reservation not found");
            yield this.reservationRepository.delete(id);
        });
    }
}
exports.ReservationService = ReservationService;
