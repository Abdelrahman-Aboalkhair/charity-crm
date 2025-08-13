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
exports.CallController = void 0;
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
class CallController {
    constructor(callService) {
        this.callService = callService;
    }
    logCall(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const data = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                const call = yield this.callService.logCall(data, userId);
                (0, sendResponse_1.default)(res, 201, {
                    data: call,
                    message: "Call logged successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCallById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const call = yield this.callService.getCallById(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: call,
                    message: "Call retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCalls(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = "1", limit = "10", donorId, userId } = req.query;
                const result = yield this.callService.getCalls({
                    page: parseInt(page),
                    limit: parseInt(limit),
                    donorId: donorId,
                    userId: userId,
                });
                (0, sendResponse_1.default)(res, 200, {
                    data: result,
                    message: "Calls retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateCall(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const call = yield this.callService.updateCall(id, data);
                (0, sendResponse_1.default)(res, 200, {
                    data: call,
                    message: "Call updated successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteCall(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.callService.deleteCall(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: {},
                    message: "Call deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CallController = CallController;
