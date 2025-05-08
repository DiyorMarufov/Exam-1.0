import { Router } from "express";

import { CategoryController } from "../controller/index.js";
import { jwtAuthMiddleware, selfGuard } from "../middleware/index.js";

const router = Router();

const controller = new CategoryController();

router
  .post("/", jwtAuthMiddleware, selfGuard, controller.createCategory)
  .get("/", jwtAuthMiddleware, controller.getAllCategories)
  .get("/:id", jwtAuthMiddleware, controller.getCategoryById)
  .patch("/:id", jwtAuthMiddleware, selfGuard, controller.updateCategoryById)
  .delete("/:id", jwtAuthMiddleware, selfGuard, controller.deleteCategoryById);

export { router as categoryRouter };
