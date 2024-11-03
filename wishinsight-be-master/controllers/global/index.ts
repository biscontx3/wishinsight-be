import { Router } from "express";

import User from "./user";
import Guest from "./guest";

const router: Router = Router();

router.use("", Guest);
router.use("", User);

export = router;
