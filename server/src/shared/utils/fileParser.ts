import * as XLSX from "xlsx";
import { parse as csvParse } from "csv-parse/sync";
import AppError from "../errors/AppError";
import { GENDER } from "@prisma/client";

interface DonorImportData {
  name: string;
  gender: GENDER;
  phone_number1?: string;
  network_provider1?: string;
  phone_number2?: string;
  network_provider2?: string;
  dob?: string;
  email?: string;
  job_title?: string;
  job_details?: string;
  province?: string;
  city?: string;
  area?: string;
  donor_conditions?: string;
  ready_to_volunteer?: boolean;
  permanent_deferral?: boolean;
}

export class FileParser {
  static parseFile(file: Express.Multer.File): DonorImportData[] {
    let data: any[] = [];

    if (file.mimetype === "text/csv") {
      data = csvParse(file.buffer, { columns: true, skip_empty_lines: true });
    } else if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      const workbook = XLSX.read(file.buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else {
      throw new AppError(400, "Unsupported file format. Use CSV, XLS, or XLSX");
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
      ready_to_volunteer:
        row.ready_to_volunteer === "true" ||
        row["Ready to Volunteer"] === "true",
      permanent_deferral:
        row.permanent_deferral === "true" ||
        row["Permanent Deferral"] === "true",
      gender: row.gender || row["Gender"],
    }));
  }
}
