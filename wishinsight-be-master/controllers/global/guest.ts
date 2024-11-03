import { Request, Response, Router, response } from "express";
import { ErrorHandler } from "../errors/ErrorHandler";
import { body, param } from "express-validator";
import { DbUser } from "../../models/submitProject/IDbUser";
import { userSignUp } from "../../services/UserService";
import { getAllItems, getUsersWithItems } from "../../services/GuestService";
import { GuestItem } from "../../models/guest/DbGuestItem";

const errorHandler = new ErrorHandler();
const router: Router = Router();

router.get("/all-items", [], async (req: Request, res: Response) => {
  try {
    const result: GuestItem[] = await getAllItems();

    return res.status(200).json(result);
  } catch (error) {
    errorHandler.HandleError(res, error, "POST  /Signup failed.");
  }
});

router.get(
  "/users/:item",
  [param("item").isString().exists()],
  async (req: Request, res: Response) => {
    try {
      const item = req.params.item;

      const result: any[] = await getUsersWithItems(item);

      return res.status(200).json({ result });
    } catch (error) {
      errorHandler.HandleError(res, error, "GET  /users/:items failed.");
    }
  }
);

export = router;
