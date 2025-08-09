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
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./infra/winston/logger"));
const compression_1 = __importDefault(require("compression"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const donor_routes_1 = __importDefault(require("./modules/donor/donor.routes"));
const donation_routes_1 = __importDefault(require("./modules/donation/donation.routes"));
const call_routes_1 = __importDefault(require("./modules/call/call.routes"));
const location_routes_1 = __importDefault(require("./modules/location/location.routes"));
const reservation_routes_1 = __importDefault(require("./modules/reservation/reservation.routes"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = __importDefault(require("./infra/cache/redis"));
const connect_redis_1 = require("connect-redis");
const constants_1 = require("./shared/constants");
const body_parser_1 = __importDefault(require("body-parser"));
const globalError_1 = __importDefault(require("./shared/errors/globalError"));
const logRequest_1 = require("./shared/middlewares/logRequest");
const NotFoundError_1 = __importDefault(require("./shared/errors/NotFoundError"));
const ForbiddenError_1 = __importDefault(require("./shared/errors/ForbiddenError"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET, constants_1.cookieParserOptions));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    store: new connect_redis_1.RedisStore({ client: redis_1.default }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));
app.use((0, helmet_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://trusted.cdn.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    },
}));
app.use(helmet_1.default.frameguard({ action: "deny" }));
const allowedOrigins = process.env.NODE_ENV === "production"
    ? ["https://egwinch.com"]
    : ["http://localhost:3000"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new ForbiddenError_1.default("CORS policy violation"));
        }
    },
    credentials: true,
}));
const allowedHosts = process.env.NODE_ENV === "production"
    ? ["egwinch.com", "www.egwinch.com"]
    : ["localhost", "127.0.0.1"];
app.use((req, res, next) => {
    if (!allowedHosts.includes(req.hostname)) {
        return next(new ForbiddenError_1.default("Forbidden"));
    }
    next();
});
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, hpp_1.default)({
    whitelist: ["sort", "filter", "fields", "page", "limit"],
}));
// Logging & Performance
app.use((0, morgan_1.default)("combined", {
    stream: {
        write: (message) => logger_1.default.info(message.trim()),
    },
}));
app.use((0, compression_1.default)());
// Routes
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/donors", donor_routes_1.default);
app.use("/api/donations", donation_routes_1.default);
app.use("/api/calls", call_routes_1.default);
app.use("/api/locations", location_routes_1.default);
app.use("/api/reservations", reservation_routes_1.default);
// **! ERROR HERE
app.all("/*", (req, res, next) => {
    const path = typeof req.originalUrl === "string" ? req.originalUrl : "unknown path";
    next(new NotFoundError_1.default(`Can't find ${path} on this server!`));
});
// Global Error Handler
app.use(globalError_1.default);
// Logger
app.use(logRequest_1.logRequest);
exports.default = app;
