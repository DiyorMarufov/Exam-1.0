import { Router } from "express";

import { EnrollmentController } from "../controller/index.js";
import { jwtAuthMiddleware, selfGuard } from "../middleware/index.js";

const router = Router();

const controller = new EnrollmentController();

router
  .post("/", jwtAuthMiddleware, controller.createEnrollment)
  .get("/", jwtAuthMiddleware, selfGuard, controller.getAllEnrollments)
  .get("/:id", jwtAuthMiddleware, controller.getEnrollmentById)
  .patch("/:id", jwtAuthMiddleware, selfGuard, controller.updateEnrollmentById)
  .delete(
    "/:id",
    jwtAuthMiddleware,
    selfGuard,
    controller.deleteEnrollmentById
  );

export { router as enrollmentRouter };
