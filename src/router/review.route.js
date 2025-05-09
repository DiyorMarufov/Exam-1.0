import { Router } from "express";

import { ReviewController } from "../controller/index.js";
import { jwtAuthMiddleware, selfGuard } from "../middleware/index.js";

const router = Router();

const controller = new ReviewController();

router
  .post("/", jwtAuthMiddleware, controller.createReview)
  .get("/", jwtAuthMiddleware, selfGuard, controller.getAllReviews)
  .get("/:id", jwtAuthMiddleware, controller.getReviewById)
  .patch("/:id", jwtAuthMiddleware, controller.updateReviewById)
  .delete("/:id", jwtAuthMiddleware, controller.deleteReviewById);

export { router as reviewRouter };
