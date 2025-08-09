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
exports.UserController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
class UserController {
    constructor(userService) {
        this.getAllUsers = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userService.getAllUsers();
            (0, sendResponse_1.default)(res, 200, {
                data: users,
                message: "Users fetched successfully",
            });
        }));
        this.getUserById = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const user = yield this.userService.getUserById(id);
            (0, sendResponse_1.default)(res, 200, {
                data: user,
                message: "User fetched successfully",
            });
        }));
        this.getUserByEmail = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            const user = yield this.userService.getUserByEmail(email);
            (0, sendResponse_1.default)(res, 200, {
                data: user,
                message: "User fetched successfully",
            });
        }));
        this.getMe = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            console.log("id: ", id);
            const user = yield this.userService.getMe(id);
            console.log("user: ", user);
            (0, sendResponse_1.default)(res, 200, {
                data: user,
                message: "User fetched successfully",
            });
        }));
        this.updateMe = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const updatedData = req.body;
            const user = yield this.userService.updateMe(id, updatedData);
            (0, sendResponse_1.default)(res, 200, {
                data: user,
                message: "User updated successfully",
            });
        }));
        this.deleteUser = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield this.userService.deleteUser(id);
            (0, sendResponse_1.default)(res, 204, { message: "User deleted successfully" });
        }));
        this.userService = userService;
    }
}
exports.UserController = UserController;
