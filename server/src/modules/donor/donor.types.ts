import { Donor, GENDER } from "@prisma/client";

export interface CreateDonorData {
  name: string;
  gender: GENDER;
  phone_number1?: string;
  phone_number2?: string;
  dob?: Date;
  email?: string;
  job_title?: string;
  province?: string;
  city?: string;
  area?: string;
}

export interface UpdateDonorData {
  name?: string;
  gender?: GENDER;
  phone_number1?: string;
  phone_number2?: string;
  dob?: Date;
  email?: string;
  job_title?: string;
  province?: string;
  city?: string;
  area?: string;
}

export interface DonorWithRelations extends Donor {
  donations?: any[];
  calls?: any[];
  reservations?: any[];
}

export interface DonorListResponse {
  donors: DonorWithRelations[];
  total: number;
  page: number;
  limit: number;
}
