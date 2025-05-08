import { Router } from "express";

import { CourseController } from "../controller/index.js";
import { jwtAuthMiddleware, selfGuard } from "../middleware/index.js";

const router = Router();

const controller = new CourseController();

router
  .post("/", jwtAuthMiddleware, selfGuard, controller.createCourse)
  .get("/", jwtAuthMiddleware, selfGuard, controller.getAllCourses)
  .get("/:id", jwtAuthMiddleware, selfGuard, controller.getCourseById)
  .patch("/:id", jwtAuthMiddleware, selfGuard, controller.updateCourseById)
  .delete("/:id", jwtAuthMiddleware, selfGuard, controller.deleteCourseById);

export { router as courseRouter };
