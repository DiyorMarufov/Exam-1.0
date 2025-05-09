import { Router } from "express";

import { UserController } from "../controller/index.js";
import {
  adminAndAuthorGuard,
  adminAndUserGuard,
  jwtAuthMiddleware,
} from "../middleware/index.js";

const router = Router();

const controller = new UserController();

// user
router
  .post("/registerUser", controller.signupUser)
  .post("/verifyOtp", controller.verifyOtp)
  .post("/loginUser", controller.signinUser)
  .post(
    "/profile",
    jwtAuthMiddleware,
    adminAndUserGuard,
    controller.profileUser
  )
  .post("/accessToken", controller.accessToken)
  .post("/signout", jwtAuthMiddleware, controller.signoutUser)
  .patch(
    "/:id",
    jwtAuthMiddleware,
    adminAndUserGuard,
    controller.updateUserById
  )
  .delete(
    "/:id",
    jwtAuthMiddleware,
    adminAndUserGuard,
    controller.deleteUserById
  )

  //author
  .post("/registerAuthor", controller.signupAuthor)
  .post("/loginAuthor", controller.signinAuthor)
  .patch(
    "/author/:id",
    jwtAuthMiddleware,
    adminAndAuthorGuard,
    controller.updateUserById
  )
  .delete(
    "/author/:id",
    jwtAuthMiddleware,
    adminAndAuthorGuard,
    controller.deleteUserById
  );
export { router as userRouter };
