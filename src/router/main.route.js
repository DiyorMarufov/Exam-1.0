import { Router } from "express";

import {
  adminRouter,
  categoryRouter,
  courseRouter,
  enrollmentRouter,
  paymentRouter,
  reviewRouter,
  userRouter,
} from "./index.js";

const router = Router();

router.use("/auth/admin", adminRouter);
router.use("/auth/user", userRouter);
router.use("/course", courseRouter);
router.use("/category", categoryRouter);
router.use("/enrollment", enrollmentRouter);
router.use("/payment", paymentRouter);
router.use("/review", reviewRouter);

export { router as mainRouter };
