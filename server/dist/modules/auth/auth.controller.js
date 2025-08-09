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
exports.AuthController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("@/shared/constants");
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const authUtils_1 = require("@/shared/utils/authUtils");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
const { maxAge } = constants_1.cookieOptions, clearCookieOptions = __rest(constants_1.cookieOptions, ["maxAge"]);
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.register = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, role } = req.body;
            const { user, accessToken, refreshToken } = yield this.authService.registerUser({
                name,
                email,
                password,
                role,
            });
            res.cookie("refreshToken", refreshToken, clearCookieOptions);
            res.cookie("accessToken", accessToken, clearCookieOptions);
            (0, sendResponse_1.default)(res, 201, {
                message: "User registered successfully",
                data: {
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        avatar: user.avatar || null,
                    },
                },
            });
        }));
        this.signin = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const { user, accessToken, refreshToken } = yield this.authService.signin({
                email,
                password,
            });
            res.cookie("refreshToken", refreshToken, clearCookieOptions);
            res.cookie("accessToken", accessToken, clearCookieOptions);
            (0, sendResponse_1.default)(res, 200, {
                data: {
                    user: {
                        id: user.id,
                        role: user.role,
                        avatar: user.avatar,
                    },
                },
                message: "User logged in successfully",
            });
        }));
        this.signout = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const refreshToken = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
            const accessToken = (_b = req === null || req === void 0 ? void 0 : req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken;
            if (refreshToken) {
                const decoded = jsonwebtoken_1.default.decode(refreshToken);
                if (decoded && decoded.absExp) {
                    const now = Math.floor(Date.now() / 1000);
                    const ttl = decoded.absExp - now;
                    if (ttl > 0) {
                        yield authUtils_1.tokenUtils.blacklistToken(refreshToken, ttl);
                    }
                }
            }
            if (accessToken) {
                const decoded = jsonwebtoken_1.default.decode(accessToken);
                if (decoded && decoded.exp) {
                    const now = Math.floor(Date.now() / 1000);
                    const ttl = decoded.exp - now;
                    if (ttl > 0) {
                        yield authUtils_1.tokenUtils.blacklistToken(accessToken, ttl);
                    }
                }
            }
            res.clearCookie("refreshToken", clearCookieOptions);
            res.clearCookie("accessToken", clearCookieOptions);
            (0, sendResponse_1.default)(res, 200, { message: "Logged out successfully" });
        }));
        this.forgotPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const response = yield this.authService.forgotPassword(email);
            (0, sendResponse_1.default)(res, 200, { message: response.message });
        }));
        this.resetPassword = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { token, newPassword } = req.body;
            const response = yield this.authService.resetPassword(token, newPassword);
            (0, sendResponse_1.default)(res, 200, { message: response.message });
        }));
        this.refreshToken = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const oldRefreshToken = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.refreshToken;
            if (!oldRefreshToken) {
                throw new AppError_1.default(401, "Refresh token not found");
            }
            const { newAccessToken, newRefreshToken } = yield this.authService.refreshToken(oldRefreshToken);
            res.cookie("refreshToken", newRefreshToken, clearCookieOptions);
            res.cookie("accessToken", newAccessToken, clearCookieOptions);
            (0, sendResponse_1.default)(res, 200, { message: "Token refreshed successfully" });
        }));
    }
}
exports.AuthController = AuthController;
