import { Router } from "express";
import { makeUserController } from "./user.factory";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import { validateDto } from "@/shared/middlewares/validateDto";
import { UpdateUserDto, UserEmailDto, UserIdDto } from "./user.dto";

const router = Router();
const userController = makeUserController();

router.get("/me", protect, userController.getMe);

router.get(
  "/",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  userController.getAllUsers
);
router.get(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserIdDto),
  userController.getUserById
);
router.get(
  "/email/:email",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserEmailDto),
  userController.getUserByEmail
);
router.put(
  "/:id",
  protect,
  authorizeRole("USER"),
  validateDto(UpdateUserDto),
  userController.updateMe
);
router.delete(
  "/:id",
  protect,
  authorizeRole("ADMIN", "SUPERADMIN"),
  validateDto(UserIdDto),
  userController.deleteUser
);

export default router;
