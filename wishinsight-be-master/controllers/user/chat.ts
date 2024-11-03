import { Request, Response, Router, response } from "express";
import { ErrorHandler } from "../errors/ErrorHandler";
import { body, param } from "express-validator";
import { DbUser } from "../../models/submitProject/IDbUser";
import { userSignUp } from "../../services/UserService";
import { ResponseToken } from "../../models/verifyAuth/ResponseToken";
import { login } from "../../services/AuthService";
import { verifyCookie, decodeToken } from "../../middleware/validators";
import {
  PostChatMessage,
  GetUserChatParticipants,
  GetUserParticipantChatHistory,
  SetUserMessageSeen,
  GetChatNotifications,
} from "../../services/MessageService";

const errorHandler = new ErrorHandler();
const router: Router = Router();

router.post(
  "/chat",
  [body("message").exists(), body("to").exists(), verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const chatBody = req.body;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      chatBody.from = userName;
      const result: boolean = await PostChatMessage(chatBody);

      return res.status(200).json(result);
    } catch (error) {
      errorHandler.HandleError(res, error, "POST  /Signup failed.");
    }
  }
);

router.get(
  "/chat/participants",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;

      const result = await GetUserChatParticipants(userName);
      return res.status(200).json(result);
    } catch (error) {
      errorHandler.HandleError(res, error, "get  /verify failed.");
    }
  }
);

router.get(
  "/chat/participants/:participant",
  [param("participant"), verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      const participant = req.params.participant;
      const result = await GetUserParticipantChatHistory(userName, participant);
      SetUserMessageSeen(userName, participant);
      return res.status(200).json(result);
    } catch (error) {
      errorHandler.HandleError(res, error, "get  /verify failed.");
    }
  }
);

router.get(
  "/chat/notification",
  [verifyCookie],
  async (req: Request, res: Response) => {
    try {
      const token = req.signedCookies["demand-token"];
      if (!token) return;
      const decodedUser: any = await decodeToken(token);
      const userName = decodedUser?.data?.username;
      const result = await GetChatNotifications(userName);
      return res.status(200).json(result);
    } catch (error) {
      errorHandler.HandleError(res, error, "get  chat/notification failed.");
    }
  }
);

export = router;
