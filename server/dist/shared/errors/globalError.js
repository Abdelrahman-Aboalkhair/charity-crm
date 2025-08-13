"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./AppError"));
const logger_1 = __importDefault(require("@/infra/winston/logger"));
const globalError = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Internal Server Error";
    let errorDetails = null;
    if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error.name === "ValidationError") {
        statusCode = 400;
        message = "Validation Error";
        errorDetails = error.details;
    }
    else if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }
    else if (error.code === 11000) {
        statusCode = 400;
        message = "Duplicate field value";
    }
    else if (error.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    else if (error.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    else if (error.name === "PrismaClientKnownRequestError") {
        switch (error.code) {
            case "P2002":
                statusCode = 400;
                message = "Duplicate entry";
                break;
            case "P2025":
                statusCode = 404;
                message = "Record not found";
                break;
            case "P2003":
                statusCode = 400;
                message = "Foreign key constraint failed";
                break;
            default:
                statusCode = 400;
                message = "Database error";
        }
    }
    // Log error
    logger_1.default.error(`Error: ${error.message}`, {
        statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        timestamp: new Date().toISOString(),
        stack: error.stack,
    });
    // Development error response
    if (process.env.NODE_ENV === "development") {
        res.status(statusCode).json({
            success: false,
            message,
            error: error.message,
            stack: error.stack,
            details: errorDetails,
        });
    }
    else {
        // Production error response
        res.status(statusCode).json({
            success: false,
            message,
        });
    }
};
exports.default = globalError;
