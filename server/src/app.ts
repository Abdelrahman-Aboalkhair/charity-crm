import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import usersRoutes from "./modules/user/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import donorRoutes from "./modules/donor/donor.routes";
import donationRoutes from "./modules/donation/donation.routes";
import callRoutes from "./modules/call/call.routes";
import locationRoutes from "./modules/location/location.routes";
import reservationRoutes from "./modules/reservation/reservation.routes";
import globalError from "./shared/errors/globalError";
import NotFoundError from "./shared/errors/NotFoundError";

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(compression());

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-domain.com"]
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Logging
app.use(morgan("combined"));

// Routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/donors", donorRoutes);
app.use("/api/v1/donations", donationRoutes);
app.use("/api/v1/calls", callRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/reservations", reservationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// 404 handler
app.all("/*", (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(globalError);

export default app;
