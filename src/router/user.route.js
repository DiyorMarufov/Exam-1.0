import { Router } from "express";

import { UserController } from "../controller/index.js";
import { jwtAuthMiddleware, selfGuard } from "../middleware/index.js";

const router = Router();

const controller = new UserController();

router
  .post("/registerUser", controller.signupUser)
  .post("/verifyOtp", controller.verifyOtp)
  .post("/loginUser", controller.signinUser)
  .post("/registerAuthor", controller.signupAuthor)
  .post("/loginAuthor", controller.signinAuthor)
  .post("/profile", jwtAuthMiddleware, controller.profileUser)
  .post("/accessToken", controller.accessToken)
  .post("/signout", jwtAuthMiddleware, controller.signoutUser)
  .patch("/:id", jwtAuthMiddleware, controller.updateUserById)
  .delete("/:id", jwtAuthMiddleware, controller.deleteUserById);

export { router as userRouter };
