import { Router } from "express";

import { AdminController } from "../controller/index.js";
import {
  jwtAuthMiddleware,
  superAdminGuard,
  selfGuard,
} from "../middleware/index.js";

const router = Router();

const controller = new AdminController();

router
  .post("/signupSuperadmin", controller.createSuperAdmin)
  .post("/signinSuperadmin", controller.signinSuperAdmin)
  .post(
    "/signupAdmin",
    jwtAuthMiddleware,
    superAdminGuard,
    controller.createAdmin
  )
  .post("/signinAdmin", controller.signInAdmin)
  .post("/accessTokenAdmin", controller.accessTokenAdmin)
  .post("/signoutAdmin", jwtAuthMiddleware, controller.signoutAdmin)
  .get("/", jwtAuthMiddleware, superAdminGuard, controller.getAllAdmins)
  .get("/users", jwtAuthMiddleware, selfGuard, controller.getAllUsers)
  .get("/teachers", jwtAuthMiddleware, selfGuard, controller.getAllTeachers)
  .patch("/:id", jwtAuthMiddleware, selfGuard, controller.updateAdminById)
  .delete(
    "/:id",
    jwtAuthMiddleware,
    superAdminGuard,
    controller.deleteAdminById
  );

export { router as adminRouter };
