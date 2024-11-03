import { NextFunction, Request, Response, Router } from "express";
import Admin from "./admin";
const router: Router = Router();

router.use("", Admin);

export = router;
