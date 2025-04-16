import { Router } from "express";
import { makeReportsController } from "../reports/reports.factory";

const router = Router();
const controller = makeReportsController();

router.get("/generate", controller.generateReport);

export default router;
