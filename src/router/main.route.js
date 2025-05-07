import { Router } from "express";

import { adminRouter } from "./index.js";

const router = Router();

router.use("/auth", adminRouter);

export { router as mainRouter };
