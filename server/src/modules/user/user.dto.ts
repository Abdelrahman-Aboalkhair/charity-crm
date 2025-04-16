import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: "Name must be a string" })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  email?: string;

  @IsOptional()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @IsString()
  password?: string;

  @IsOptional()
  @IsIn(["user", "admin"], { message: "Role must be either 'user' or 'admin'" })
  role?: string;
}

export class UserIdDto {
  @IsNotEmpty({ message: "ID is required" })
  @IsString({ message: "ID must be a string" })
  id!: string;
}

export class UserEmailDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email!: string;
}
