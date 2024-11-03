import logger from "../../logger";
import { StatusError } from "./StatusError";
import { Response } from "express";

export class ErrorHandler {
  HandleError(
    response: Response,
    error: unknown,
    defaultErrorMessage: string
  ): void {
    if (error instanceof StatusError) {
      response.status(error.statusCode);
      response.json({ msg: error.message });
    } else {
      logger.error(error, defaultErrorMessage);
      response.status(500);
      response.json({ error: error });
    }
  }
}
