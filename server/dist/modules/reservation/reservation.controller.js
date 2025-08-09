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
exports.ReservationController = void 0;
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const reservation_service_1 = require("./reservation.service");
class ReservationController {
    constructor() {
        this.reservationService = new reservation_service_1.ReservationService();
    }
    createReservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { donorId, expiresAt } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const reservation = yield this.reservationService.createReservation(donorId, new Date(expiresAt), userId);
                (0, sendResponse_1.default)(res, 201, {
                    data: reservation,
                    message: "Reservation created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReservationById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const reservation = yield this.reservationService.getReservationById(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: reservation,
                    message: "Reservation retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getReservations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = "1", limit = "10", donorId, userId } = req.query;
                const result = yield this.reservationService.getReservations({
                    page: parseInt(page),
                    limit: parseInt(limit),
                    donorId: donorId,
                    userId: userId,
                });
                (0, sendResponse_1.default)(res, 200, {
                    data: result,
                    message: "Reservations retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateReservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const reservation = yield this.reservationService.updateReservation(id, data);
                (0, sendResponse_1.default)(res, 200, {
                    data: reservation,
                    message: "Reservation updated successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteReservation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.reservationService.deleteReservation(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: {},
                    message: "Reservation deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.ReservationController = ReservationController;
