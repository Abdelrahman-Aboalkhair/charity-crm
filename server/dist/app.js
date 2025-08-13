"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const donor_routes_1 = __importDefault(require("./modules/donor/donor.routes"));
const donation_routes_1 = __importDefault(require("./modules/donation/donation.routes"));
const call_routes_1 = __importDefault(require("./modules/call/call.routes"));
const location_routes_1 = __importDefault(require("./modules/location/location.routes"));
const reservation_routes_1 = __importDefault(require("./modules/reservation/reservation.routes"));
const globalError_1 = __importDefault(require("./shared/errors/globalError"));
const NotFoundError_1 = __importDefault(require("./shared/errors/NotFoundError"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Basic middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// CORS
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === "production"
        ? ["https://your-domain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
}));
// Logging
app.use((0, morgan_1.default)("combined"));
// Routes
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/donors", donor_routes_1.default);
app.use("/api/v1/donations", donation_routes_1.default);
app.use("/api/v1/calls", call_routes_1.default);
app.use("/api/v1/locations", location_routes_1.default);
app.use("/api/v1/reservations", reservation_routes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
// 404 handler
app.all("/*", (req, res, next) => {
    next(new NotFoundError_1.default(`Can't find ${req.originalUrl} on this server!`));
});
// Global Error Handler
app.use(globalError_1.default);
exports.default = app;
