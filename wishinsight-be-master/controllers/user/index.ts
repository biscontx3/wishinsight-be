import { NextFunction, Request, Response, Router } from "express";
import User from "./user";
import Chat from "./chat";
const router: Router = Router();

router.use("", User);
router.use("", Chat);

export = router;
