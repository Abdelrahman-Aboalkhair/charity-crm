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
exports.LocationRepository = void 0;
const database_config_1 = __importDefault(require("@/infra/database/database.config"));
class LocationRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.location.create({ data });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.location.findUnique({
                where: { id },
            });
        });
    }
    findMany(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.location.findMany({
                skip: params.skip,
                take: params.take,
                where: params.where,
                orderBy: params.orderBy,
            });
        });
    }
    count(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.location.count({ where });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.location.update({
                where: { id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return database_config_1.default.location.delete({ where: { id } });
        });
    }
}
exports.LocationRepository = LocationRepository;
