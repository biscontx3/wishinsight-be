import { Application, NextFunction, Request, Response } from "express";
import Global from "./controllers/global/index";
import Admin from "./controllers/admin/index";
import User from "./controllers/user/index";
import logger from "./logger";

export = (app: any): void => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (
      req.secure ||
      req.hostname === "localhost" ||
      req.hostname === "127.0.0.1"
    ) {
      next();
    } else {
      res.redirect("https://" + req.headers.host + req.url);
    }
  });

  app.use("", Global);
  app.use("", User);
  app.use("/admin", Admin);

  app.use((req: Request, res: Response, next: NextFunction) => {
    next({
      msg: "Not found",
      status: 404,
    });
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SyntaxError) {
      res.status(400).json({ msg: "The body does not contain valid json" });
    } else if (err.status === 404) {
      res.status(404).json({ msg: "Path not found" });
    } else {
      res.status(500).json({ msg: "Server error. Something went wrong" });
    }
  });
};
