import AppError from "@/shared/errors/AppError";
import { UserRepository } from "./user.repository";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers() {
    return await this.userRepository.findAllUsers();
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async getMe(id: string | undefined) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return user;
  }

  async updateMe(
    id: string,
    data: Partial<{
      name?: string;
      email?: string;
      avatar?: string;
    }>
  ) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return await this.userRepository.updateUser(id, data);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    await this.userRepository.deleteUser(id);
  }
}
