"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileParser = void 0;
const XLSX = __importStar(require("xlsx"));
const sync_1 = require("csv-parse/sync");
const AppError_1 = __importDefault(require("../errors/AppError"));
class FileParser {
    static parseFile(file) {
        let data = [];
        if (file.mimetype === "text/csv") {
            data = (0, sync_1.parse)(file.buffer, { columns: true, skip_empty_lines: true });
        }
        else if (file.mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            file.mimetype === "application/vnd.ms-excel") {
            const workbook = XLSX.read(file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            data = XLSX.utils.sheet_to_json(worksheet);
        }
        else {
            throw new AppError_1.default(400, "Unsupported file format. Use CSV, XLS, or XLSX");
        }
        return data.map((row) => ({
            name: row.name || row["Name"],
            phone_number1: row.phone_number1 || row["Phone Number 1"],
            network_provider1: row.network_provider1 || row["Network Provider 1"],
            phone_number2: row.phone_number2 || row["Phone Number 2"],
            network_provider2: row.network_provider2 || row["Network Provider 2"],
            dob: row.dob || row["Date of Birth"],
            email: row.email || row["Email"],
            job_title: row.job_title || row["Job Title"],
            job_details: row.job_details || row["Job Details"],
            province: row.province || row["Province"],
            city: row.city || row["City"],
            area: row.area || row["Area"],
            donor_conditions: row.donor_conditions || row["Donor Conditions"],
            ready_to_volunteer: row.ready_to_volunteer === "true" ||
                row["Ready to Volunteer"] === "true",
            permanent_deferral: row.permanent_deferral === "true" ||
                row["Permanent Deferral"] === "true",
            gender: row.gender || row["Gender"],
        }));
    }
}
exports.FileParser = FileParser;
