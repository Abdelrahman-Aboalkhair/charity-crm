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
exports.CallService = void 0;
const call_repository_1 = require("./call.repository");
const reservation_repository_1 = require("../reservation/reservation.repository");
const donor_repository_1 = require("../donor/donor.repository");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class CallService {
    constructor() {
        this.callRepository = new call_repository_1.CallRepository();
        this.reservationRepository = new reservation_repository_1.ReservationRepository();
        this.donorRepository = new donor_repository_1.DonorRepository();
    }
    logCall(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(data.donor_id);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            // Check if there's an active reservation by this user
            const reservation = yield this.reservationRepository.findActiveByDonor(data.donor_id);
            if (reservation && reservation.reserved_by_user_id !== userId) {
                throw new AppError_1.default(403, "Donor is reserved by another user");
            }
            const callData = Object.assign(Object.assign({}, data), { called_by_user_id: userId, call_date: new Date(data.call_date), reservation_id: reservation === null || reservation === void 0 ? void 0 : reservation.id });
            const call = yield this.callRepository.create(callData);
            // Update reservation status if applicable
            if (reservation) {
                yield this.reservationRepository.update(reservation.id, {
                    status: "COMPLETED",
                });
            }
            return call;
        });
    }
    getCallById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.callRepository.findById(id);
            if (!call)
                throw new AppError_1.default(404, "Call not found");
            return call;
        });
    }
    getCalls(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit, donorId, userId } = params;
            const skip = (page - 1) * limit;
            const where = {
                donor_id: donorId,
                called_by_user_id: userId,
            };
            const [calls, total] = yield Promise.all([
                this.callRepository.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { call_date: "desc" },
                }),
                this.callRepository.count(where),
            ]);
            return { calls, total };
        });
    }
    updateCall(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.callRepository.findById(id);
            if (!call)
                throw new AppError_1.default(404, "Call not found");
            return this.callRepository.update(id, data);
        });
    }
    deleteCall(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const call = yield this.callRepository.findById(id);
            if (!call)
                throw new AppError_1.default(404, "Call not found");
            yield this.callRepository.delete(id);
        });
    }
}
exports.CallService = CallService;
