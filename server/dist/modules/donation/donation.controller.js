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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationController = void 0;
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
class DonationController {
    constructor(donationService) {
        this.donationService = donationService;
    }
    createDonation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const _b = req.body, { deferral } = _b, donationData = __rest(_b, ["deferral"]);
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const donation = yield this.donationService.createDonation(donationData, userId, deferral
                    ? {
                        deferral_type: deferral.deferral_type,
                        start_date: new Date(deferral.start_date),
                        expected_end_date: new Date(deferral.expected_end_date),
                        notes: deferral.notes,
                    }
                    : undefined);
                (0, sendResponse_1.default)(res, 201, {
                    data: { donation },
                    message: "Donation created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDonationById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const donation = yield this.donationService.getDonationById(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: donation,
                    message: "Donation retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDonations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = "1", limit = "10", donorId } = req.query;
                const result = yield this.donationService.getDonations({
                    page: parseInt(page),
                    limit: parseInt(limit),
                    donorId: donorId,
                });
                (0, sendResponse_1.default)(res, 200, {
                    data: result,
                    message: "Donations retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDonation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const donation = yield this.donationService.updateDonation(id, data);
                (0, sendResponse_1.default)(res, 200, {
                    data: donation,
                    message: "Donation updated successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDonation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.donationService.deleteDonation(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: {},
                    message: "Donation deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.DonationController = DonationController;
