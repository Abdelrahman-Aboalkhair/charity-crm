import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { cookieOptions } from "@/shared/constants";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import { AuthService } from "./auth.service";
import { tokenUtils } from "@/shared/utils/authUtils";
import AppError from "@/shared/errors/AppError";

const { maxAge, ...clearCookieOptions } = cookieOptions;

export class AuthController {
  constructor(private authService: AuthService) {}

  register = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, email, password, role } = req.body;
      const { user, accessToken, refreshToken } =
        await this.authService.registerUser({
          name,
          email,
          password,
          role,
        });

      res.cookie("refreshToken", refreshToken, clearCookieOptions);
      res.cookie("accessToken", accessToken, clearCookieOptions);

      sendResponse(res, 201, {
        message: "User registered successfully",
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar || null,
          },
        },
      });
    }
  );

  signin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.authService.signin({
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, clearCookieOptions);

    sendResponse(res, 200, {
      data: {
        user: {
          id: user.id,
          role: user.role,
          avatar: user.avatar,
        },
        token: accessToken,
      },
      message: "User logged in successfully",
    });
  });

  signout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req?.cookies?.refreshToken;
    const accessToken = req?.cookies?.accessToken;

    if (refreshToken) {
      const decoded: any = jwt.decode(refreshToken);
      if (decoded && decoded.absExp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.absExp - now;
        if (ttl > 0) {
          await tokenUtils.blacklistToken(refreshToken, ttl);
        }
      }
    }

    if (accessToken) {
      const decoded: any = jwt.decode(accessToken);
      if (decoded && decoded.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;
        if (ttl > 0) {
          await tokenUtils.blacklistToken(accessToken, ttl);
        }
      }
    }

    res.clearCookie("refreshToken", clearCookieOptions);
    res.clearCookie("accessToken", clearCookieOptions);

    sendResponse(res, 200, { message: "Logged out successfully" });
  });

  forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email } = req.body;
      const response = await this.authService.forgotPassword(email);

      sendResponse(res, 200, { message: response.message });
    }
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { token, newPassword } = req.body;
      const response = await this.authService.resetPassword(token, newPassword);

      sendResponse(res, 200, { message: response.message });
    }
  );

  refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const oldRefreshToken = req?.cookies?.refreshToken;

      if (!oldRefreshToken) {
        throw new AppError(401, "Refresh token not found");
      }

      const { newAccessToken, newRefreshToken } =
        await this.authService.refreshToken(oldRefreshToken);

      res.cookie("refreshToken", newRefreshToken, clearCookieOptions);
      res.cookie("accessToken", newAccessToken, clearCookieOptions);

      sendResponse(res, 200, { message: "Token refreshed successfully" });
    }
  );
}
