import { Router } from "express";

import { ReviewController } from "../controller/index.js";
import { jwtAuthMiddleware, selfGuard } from "../middleware/index.js";

const router = Router();

const controller = new ReviewController();

router
  .post("/", jwtAuthMiddleware, selfGuard, controller.createReview)
  .get("/", jwtAuthMiddleware, selfGuard, controller.getAllReviews)
  .get("/:id", jwtAuthMiddleware, selfGuard, controller.getReviewById)
  .patch("/:id", jwtAuthMiddleware, selfGuard, controller.updateReviewById)
  .delete("/:id", jwtAuthMiddleware, selfGuard, controller.deleteReviewById);

export { router as reviewRouter };
