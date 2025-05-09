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
  // superadmin
  .post("/signupSuperadmin", controller.createSuperAdmin)
  .post("/signinSuperadmin", controller.signinSuperAdmin)
  .get("/", jwtAuthMiddleware, superAdminGuard, controller.getAllAdmins)
  .patch(
    "/superadmin/:id",
    jwtAuthMiddleware,
    superAdminGuard,
    controller.updateAdminById
  )
  .delete(
    "/superadmin/:id",
    jwtAuthMiddleware,
    superAdminGuard,
    controller.deleteAdminById
  )

  // admin
  .post(
    "/signupAdmin",
    jwtAuthMiddleware,
    superAdminGuard,
    controller.createAdmin
  )
  .post("/signinAdmin", controller.signInAdmin)
  .post("/accessTokenAdmin", controller.accessTokenAdmin)
  .post("/signoutAdmin", jwtAuthMiddleware, controller.signoutAdmin)
  .patch("/admin/:id", jwtAuthMiddleware, selfGuard, controller.updateAdminById)
  .delete(
    "/admin/:id",
    jwtAuthMiddleware,
    superAdminGuard,
    controller.deleteAdminById
  )

  .get("/users", jwtAuthMiddleware, selfGuard, controller.getAllUsers)
  .get("/teachers", jwtAuthMiddleware, selfGuard, controller.getAllTeachers)
  .get("/stats", jwtAuthMiddleware, selfGuard, controller.showStats);

export { router as adminRouter };
