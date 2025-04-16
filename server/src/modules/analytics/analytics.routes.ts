import { Router } from "express";
import { makeAnalyticsController } from "./analytics.factory";
import protect from "@/shared/middlewares/protect";
import authorizeRole from "@/shared/middlewares/authorizeRole";
import optionalAuth from "@/shared/middlewares/optionalAuth";

const router = Router();
const controller = makeAnalyticsController();

router.get("/overview", protect, controller.getAnalyticsOverview);
router.get("/year-range", protect, controller.getYearRange);
router.get("/products", protect, controller.getProductPerformance);
router.get("/customers", protect, controller.getCustomerAnalytics);
router.get("/interactions", protect, controller.getInteractionAnalytics);
router.post("/interactions", optionalAuth, controller.recordInteraction);
router.get("/export", protect, controller.exportAnalytics);

export default router;
