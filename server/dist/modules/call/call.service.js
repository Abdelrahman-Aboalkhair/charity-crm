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
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class CallService {
    constructor(callRepository, donorRepository) {
        this.callRepository = callRepository;
        this.donorRepository = donorRepository;
    }
    logCall(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const donor = yield this.donorRepository.findById(data.donor_id);
            if (!donor)
                throw new AppError_1.default(404, "Donor not found");
            const callData = Object.assign(Object.assign({}, data), { called_by_user_id: userId, call_date: new Date(data.call_date) });
            return this.callRepository.create(callData);
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
            const where = {};
            if (donorId)
                where.donor_id = donorId;
            if (userId)
                where.called_by_user_id = userId;
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
