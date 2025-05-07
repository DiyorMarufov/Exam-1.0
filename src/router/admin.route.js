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
  .get("/admins", jwtAuthMiddleware, superAdminGuard, controller.getAllAdmins)
  .patch("/admin/:id", jwtAuthMiddleware, selfGuard, controller.updateAdminById)
  .delete(
    "/admin/:id",
    jwtAuthMiddleware,
    superAdminGuard,
    controller.deleteAdminById
  );

export { router as adminRouter };
