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
exports.LocationController = void 0;
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
class LocationController {
    constructor(locationService) {
        this.locationService = locationService;
    }
    createLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const location = yield this.locationService.createLocation(data);
                (0, sendResponse_1.default)(res, 201, {
                    data: location,
                    message: "Location created successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLocationById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const location = yield this.locationService.getLocationById(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: location,
                    message: "Location retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getLocations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = "1", limit = "10" } = req.query;
                const result = yield this.locationService.getLocations({
                    page: parseInt(page),
                    limit: parseInt(limit),
                });
                (0, sendResponse_1.default)(res, 200, {
                    data: result,
                    message: "Locations retrieved successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const data = req.body;
                const location = yield this.locationService.updateLocation(id, data);
                (0, sendResponse_1.default)(res, 200, {
                    data: location,
                    message: "Location updated successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteLocation(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield this.locationService.deleteLocation(id);
                (0, sendResponse_1.default)(res, 200, {
                    data: {},
                    message: "Location deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.LocationController = LocationController;
