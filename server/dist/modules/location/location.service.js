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
exports.LocationService = void 0;
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class LocationService {
    constructor(locationRepository) {
        this.locationRepository = locationRepository;
    }
    createLocation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.locationRepository.create(data);
        });
    }
    getLocationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield this.locationRepository.findById(id);
            if (!location)
                throw new AppError_1.default(404, "Location not found");
            return location;
        });
    }
    getLocations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = params;
            const skip = (page - 1) * limit;
            const [locations, total] = yield Promise.all([
                this.locationRepository.findMany({
                    skip,
                    take: limit,
                    orderBy: { name: "asc" },
                }),
                this.locationRepository.count(),
            ]);
            return { locations, total };
        });
    }
    updateLocation(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield this.locationRepository.findById(id);
            if (!location)
                throw new AppError_1.default(404, "Location not found");
            return this.locationRepository.update(id, data);
        });
    }
    deleteLocation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = yield this.locationRepository.findById(id);
            if (!location)
                throw new AppError_1.default(404, "Location not found");
            yield this.locationRepository.delete(id);
        });
    }
}
exports.LocationService = LocationService;
