import { Request, Response, Router, response, CookieOptions } from "express";
import { ErrorHandler } from "../errors/ErrorHandler";
import { body, param } from "express-validator";
import { DbUser } from "../../models/submitProject/IDbUser";
import { userSignUp } from "../../services/UserService";
import { ResponseToken } from "../../models/verifyAuth/ResponseToken";
import { login } from "../../services/AuthService";
import {
  verifyjwt,
  decodeToken,
  verifyCookie,
} from "../../middleware/validators";

const errorHandler = new ErrorHandler();
const router: Router = Router();

router.get("/logout", async (req: Request, res: Response) => {
  try {
    let options: any;
    if (process.env.NODE_ENV === "production") {
      options = {
        domain: "wishinsight.com",
        secure: true,
        httpOnly: true,
        sameSite: "lax",
      };
    } else {
      options = {
        secure: false,
        httpOnly: false,
      };
    }

    res.clearCookie("demand-token", options);
    return res.status(200).json("Logged out");
  } catch (error) {
    console.log("error");
  }
});

router.post(
  "/signup",
  [
    body("username").exists(),
    body("password").exists(),
    body("zipcode").exists(),
    body("email").exists(),
  ],
  async (req: Request, res: Response) => {
    try {
      const user = new DbUser(req.body);

      const result: boolean = await userSignUp(user);

      return res.status(200).json(result);
    } catch (error) {
      errorHandler.HandleError(res, error, "POST  /Signup failed.");
    }
  }
);

router.post(
  "/login",
  [body("username").exists(), body("password").exists()],
  async (req: Request, res: Response) => {
    try {
      const username: string = req.body.username;
      const password: string = req.body.password;

      const responseToken: ResponseToken = await login(username, password);
      let options: CookieOptions;
      if (process.env.NODE_ENV === "production") {
        options = {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
          signed: true,
          secure: true, // Ensure secure cookies in production
          sameSite: "lax",
          domain: "wishinsight.com",
        };
      } else {
        options = {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: false,
          signed: true,
          secure: false, // Ensure secure cookies in production
        };
      }

      // Set cookie
      res.cookie("demand-token", responseToken.token, options);
      return res.status(200).json(true);
    } catch (error) {
      errorHandler.HandleError(res, error, "POST  /login failed.");
    }
  }
);

router.get("/verify", [verifyCookie], async (req: Request, res: Response) => {
  try {
    const token = req.signedCookies["demand-token"];
    if (!token) return res.status(401).send("Unauthorized");

    const decodedUser: any = await decodeToken(token);
    const userName = decodedUser?.data?.username;
    return res.status(200).json(userName);
  } catch (error) {
    res.clearCookie("demand-token");
    return res.status(500);
  }
});

// router.get(
//   "/verify",
//   [body("token").exists().isString(), verifyjwt],
//   async (req: Request, res: Response) => {
//     try {
//       return res.status(204).json();
//     } catch (error) {
//       errorHandler.HandleError(res, error, "get  /verify failed.");
//     }
//   }
// );

export = router;
