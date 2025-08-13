import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from "class-validator";
import { GENDER } from "@prisma/client";

export class CreateDonorDto {
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  name!: string;

  @IsEnum(GENDER, { message: "Gender must be MALE or FEMALE" })
  gender!: GENDER;

  @IsOptional()
  @IsString()
  phone_number1?: string;

  @IsOptional()
  @IsString()
  phone_number2?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  area?: string;
}

export class UpdateDonorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @IsString()
  phone_number1?: string;

  @IsOptional()
  @IsString()
  phone_number2?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  area?: string;
}
