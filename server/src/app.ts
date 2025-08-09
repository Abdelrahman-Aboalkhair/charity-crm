import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import logger from "./infra/winston/logger";
import compression from "compression";
import usersRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import donorRoutes from "./modules/donor/donor.routes";
import donationRoutes from "./modules/donation/donation.routes";
import callRoutes from "./modules/call/call.routes";
import locationRoutes from "./modules/location/location.routes";
import reservationRoutes from "./modules/reservation/reservation.routes";
import session from "express-session";
import redisClient from "./infra/cache/redis";
import { RedisStore } from "connect-redis";
import { cookieParserOptions } from "./shared/constants";
import bodyParser from "body-parser";
import globalError from "./shared/errors/globalError";
import { logRequest } from "./shared/middlewares/logRequest";
import NotFoundError from "./shared/errors/NotFoundError";
import ForbiddenError from "./shared/errors/ForbiddenError";

dotenv.config();

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET, cookieParserOptions));

app.use(cookieParser());

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted.cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(helmet.frameguard({ action: "deny" }));

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://egwinch.com"]
    : ["http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new ForbiddenError("CORS policy violation"));
      }
    },
    credentials: true,
  })
);

const allowedHosts =
  process.env.NODE_ENV === "production"
    ? ["egwinch.com", "www.egwinch.com"]
    : ["localhost", "127.0.0.1"];

app.use((req, res, next) => {
  if (!allowedHosts.includes(req.hostname)) {
    return next(new ForbiddenError("Forbidden"));
  }
  next();
});

app.use(ExpressMongoSanitize());
app.use(
  hpp({
    whitelist: ["sort", "filter", "fields", "page", "limit"],
  })
);

// Logging & Performance
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(compression());

// Routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/calls", callRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/reservations", reservationRoutes);

// **! ERROR HERE
app.all("/*", (req, res, next) => {
  const path =
    typeof req.originalUrl === "string" ? req.originalUrl : "unknown path";
  next(new NotFoundError(`Can't find ${path} on this server!`));
});

// Global Error Handler
app.use(globalError);

// Logger
app.use(logRequest);

export default app;
