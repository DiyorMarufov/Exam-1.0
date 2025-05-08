import { Router } from "express";

import { PaymentController } from "../controller/index.js";
import { jwtAuthMiddleware, selfGuard } from "../middleware/index.js";

const router = Router();

const controller = new PaymentController();

router
  .post("/", jwtAuthMiddleware, selfGuard, controller.createPayment)
  .get("/", jwtAuthMiddleware, selfGuard, controller.getAllPayments)
  .get("/:id", jwtAuthMiddleware, selfGuard, controller.getPaymentById)
  .patch("/:id", jwtAuthMiddleware, selfGuard, controller.updatePaymentById)
  .delete("/:id", jwtAuthMiddleware, selfGuard, controller.deletePaymentById);

export { router as paymentRouter };
