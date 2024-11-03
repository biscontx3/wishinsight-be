import jwt from "jsonwebtoken";
import { Timestamp } from "@google-cloud/firestore";
import { StatusError } from "../controllers/errors/StatusError";
import { getSecret } from "./secrets";
export const getUserNameFromToken = async (req: any, res: any) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json("Unauthorized user");
  const hash = await getSecret();

  try {
    const decoded = jwt.verify(token, hash.Remote.salt);
    req.user = decoded;
    return decoded;
  } catch (e) {
    res.status(400).json("Token not valid");
  }
};

export const convertDateToTimestamp = (date: string) => {
  const dateToConvert = new Date(date);
  return Timestamp.fromDate(dateToConvert).seconds;
};

export const getTokenData = async (req: any, res: any) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json("Unauthorized user");
  const hash = await getSecret();
  try {
    const decoded = jwt.verify(token, hash.Remote.salt);
    req.user = decoded;
    return decoded;
  } catch (e) {
    throw new StatusError(401, `Token not valid`);
  }
};
