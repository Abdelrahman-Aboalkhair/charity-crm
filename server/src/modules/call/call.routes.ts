import { Router } from "express";
import protect from "@/shared/middlewares/protect";
import { makeCallController } from "./call.factory";

const router = Router();
const callController = makeCallController();

router.post("/", protect, (req, res, next) =>
  callController.logCall(req, res, next)
);

router.get("/:id", protect, (req, res, next) =>
  callController.getCallById(req, res, next)
);

router.get("/", protect, (req, res, next) =>
  callController.getCalls(req, res, next)
);

router.put("/:id", protect, (req, res, next) =>
  callController.updateCall(req, res, next)
);

router.delete("/:id", protect, (req, res, next) =>
  callController.deleteCall(req, res, next)
);

export default router;
