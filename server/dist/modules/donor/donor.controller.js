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
exports.DonorController = void 0;
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class DonorController {
    constructor(donorService) {
        this.donorService = donorService;
    }
    createDonor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const donor = yield this.donorService.createDonor(data);
                (0, sendResponse_1.default)(res, 201, {
                    data: { donor },
                    message: "Donor created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    bulkImportDonors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file)
                    throw new AppError_1.default(400, "No file uploaded");
                const result = yield this.donorService.bulkImportDonors(req.file);
                (0, sendResponse_1.default)(res, 200, {
                    data: { result },
                    message: "Donors imported successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDonorById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const donor = yield this.donorService.getDonorById(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: { donor },
                    message: "Donor retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDonors(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = "1", limit = "10", search } = req.query;
                const result = yield this.donorService.getDonors({
                    page: parseInt(page),
                    limit: parseInt(limit),
                    search: search,
                });
                (0, sendResponse_1.default)(res, 200, {
                    data: { donors: result.donors, total: result.total },
                    message: "Donors retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDonor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const donor = yield this.donorService.updateDonor(id, data);
                (0, sendResponse_1.default)(res, 200, {
                    data: { donor },
                    message: "Donor updated successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDonor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.donorService.deleteDonor(id);
                (0, sendResponse_1.default)(res, 200, {
                    message: "Donor deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.DonorController = DonorController;
