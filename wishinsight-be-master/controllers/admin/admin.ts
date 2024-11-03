import { Request, Response, Router } from "express";
import { ErrorHandler } from "../errors/ErrorHandler";
import { body, param } from "express-validator";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

import {
  verifyjwt,
  isFirestoreId,
  isSuperAdmin,
} from "../../middleware/validators";

const client = new SecretManagerServiceClient();

const errorHandler = new ErrorHandler();
const router: Router = Router();

// router.get(
//   "/pending",
//   [verifyjwt, isSuperAdmin],
//   async (req: Request, res: Response) => {
//     try {
//       const result = await getAllPendingJobsForAdmin();
//       return res.status(200).json(result);
//     } catch (error) {
//       errorHandler.HandleError(res, error, "GET  /pending failed.");
//     }
//   }
// );

// router.post(
//   "/listing/approve/:id",
//   [
//     param("id").custom((l) => isFirestoreId(l)),
//     param("id").isString().exists(),
//     verifyjwt,
//     isSuperAdmin,
//   ],
//   async (req: Request, res: Response) => {
//     try {
//       const jobId = req.params.id;
//       const result = await approvePendingJobSubmission(jobId);
//       return res.status(200).json(result);
//     } catch (error) {
//       errorHandler.HandleError(res, error, "POST  /update_proile failed.");
//     }
//   }
// );

// router.post(
//   "/listing/reject/:id",
//   [
//     param("id").custom((l) => isFirestoreId(l)),
//     param("id").isString().exists(),
//     verifyjwt,
//     isSuperAdmin,
//   ],
//   async (req: Request, res: Response) => {
//     try {
//       const jobId = req.params.id;
//       const result = await rejectPendingJobSubmission(jobId);
//       return res.status(200).json(result);
//     } catch (error) {
//       errorHandler.HandleError(res, error, "POST  /update_proile failed.");
//     }
//   }
// );

export = router;
