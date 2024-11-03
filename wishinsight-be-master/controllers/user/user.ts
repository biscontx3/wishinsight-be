import { Request, Response, Router } from "express";
import { ErrorHandler } from "../errors/ErrorHandler";

import { DbVerifyAuth } from "../../models/verifyAuth/VerifyAuth";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { ResponseToken } from "../../models/verifyAuth/ResponseToken";

import {
  verifyCookie,
  isFirestoreId,
  validateCompanyRequest,
  decodeToken,
} from "../../middleware/validators";
import { getTokenData } from "../../middleware/utils";
import {
  addItemRequestToUser,
  getUserWishItems,
  getUserBargainItems,
  deleteItem,
  getAllItemNames,
  addSellingItemRequestToUser,
  getUserSellingItems,
} from "../../services/UserService";
import { param } from "express-validator";

const client = new SecretManagerServiceClient();

const errorHandler = new ErrorHandler();
const router: Router = Router();

router.post(
  "/user/add-request",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const item = req.body;
      const userName = decodedUser?.data?.username;
      await addItemRequestToUser(userName, item);
      return res.status(204).json();
    } catch (error) {
      errorHandler.HandleError(res, error, "post  /user/add-request failed.");
    }
  }
);

router.post(
  "/user/add-selling-item",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const item = req.body;
      const userName = decodedUser?.data?.username;
      await addSellingItemRequestToUser(userName, item);
      return res.status(204).json();
    } catch (error) {
      errorHandler.HandleError(res, error, "post  /user/add-request failed.");
    }
  }
);

router.get(
  "/user/selling-items",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      const result = await getUserSellingItems(userName);
      return res.status(200).json({ items: result });
    } catch (error) {
      errorHandler.HandleError(res, error, "get /user/niche-items failed.");
    }
  }
);

router.get(
  "/user/niche-items",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      const result = await getUserWishItems(userName);
      return res.status(200).json({ items: result });
    } catch (error) {
      errorHandler.HandleError(res, error, "get /user/niche-items failed.");
    }
  }
);

router.get(
  "/user/bargain-items",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      const result = await getUserBargainItems(userName);
      return res.status(200).json({ items: result });
    } catch (error) {
      errorHandler.HandleError(res, error, "get /user/bargain-items failed.");
    }
  }
);

router.get(
  "/user/item-names",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const result = await getAllItemNames();
      return res.status(200).json({ items: result });
    } catch (error) {
      errorHandler.HandleError(res, error, "get /item-names failed.");
    }
  }
);

router.delete(
  "/user/itemselling/:id",
  [param("id"), verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      const itemId = req.params.id;
      await deleteItem(userName, itemId);
      return res.status(204).json();
    } catch (error) {
      errorHandler.HandleError(res, error, "Delete user/itemid failed.");
    }
  }
);

router.delete(
  "/user/item/:id",
  [param("id"), verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      const itemId = req.params.id;
      await deleteItem(userName, itemId);
      return res.status(204).json();
    } catch (error) {
      errorHandler.HandleError(res, error, "Delete user/itemid failed.");
    }
  }
);

router.get(
  "/user/verifyname",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      return res.status(200).json(userName);
    } catch (error) {
      errorHandler.HandleError(res, error, "get  /verifyname failed.");
    }
  }
);

export = router;
