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
exports.ReservationRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class ReservationRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.reservation.create({ data });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.reservation.findUnique({
                where: { id },
                include: { donor: true, reserved_by_user: true },
            });
        });
    }
    findActiveByDonor(donor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.reservation.findFirst({
                where: {
                    donor_id,
                    status: "ACTIVE",
                    expires_at: { gt: new Date() },
                },
                include: { donor: true, reserved_by_user: true },
            });
        });
    }
    findMany(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.reservation.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                orderBy: params.orderBy,
                include: { donor: true, reserved_by_user: true },
            });
        });
    }
    count(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.reservation.count({ where });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.reservation.update({
                where: { id },
                data,
                include: { donor: true, reserved_by_user: true },
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.reservation.delete({ where: { id } });
        });
    }
}
exports.ReservationRepository = ReservationRepository;
