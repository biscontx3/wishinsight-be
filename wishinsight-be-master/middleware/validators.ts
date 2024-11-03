import jwt from "jsonwebtoken";
import { getSecret } from "./secrets";

export const verifyjwt = async (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json("Unauthorized user");
  try {
    const hash = await getSecret();
    const decoded = jwt.verify(token, hash.demand.salt);
    req.user = decoded;
    next();
  } catch (e) {
    if (e instanceof SyntaxError) {
      //Handle SyntaxError here.
      console.log(e);
    }
    res.clearCookie("demand-token");
    res.status(401).json("Token not valid");
  }
};

export const verifyCookie = async (req: any, res: any, next: any) => {
  try {
    const hash = await getSecret();
    const token = req.signedCookies["demand-token"];
    if (!token) return res.status(401).json("Unauthorized user");
    const decoded = jwt.verify(token, hash.demand.salt);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof SyntaxError) {
      //Handle SyntaxError here.
      console.log(error);
    }
    res.status(401).json("Token not valid");
  }
};

export const isSuperAdmin = async (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json("Unauthorized user superadmin");
  try {
    const hash = await getSecret();
    const decoded = jwt.verify(token, hash.Remote.salt);
    req.user = decoded;
    if (req.user.data.isSuperAdmin) {
      next();
    } else {
      throw new Error("User not superadmin");
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      //Handle SyntaxError here.
      console.log(e);
    }
    res.status(401).json("Not superadmin");
  }
};

/**
 * Checks if the format of the input matches with the format of a firestore ID.
 *
 * @param id Input to check for firestore ID format.
 * @returns true, if it matches firestore ID format.
 * @throws Value is not a firestore id.
 */
export function isFirestoreId(id: string): boolean {
  const regex = RegExp("^[a-zA-Z0-9]{20}$");
  if (regex.test(id)) {
    return true;
  } else {
    throw new Error("Value is not a firestore id.");
  }
}

/**
 * Checks if companyid is the same as in token.
 *
 * @param id Id of the company.
 * @param requestedId Id of the company to add or change.
 * @returns true, if it matches company ID .
 * @throws Value if not the same company id.
 */
export function validateCompanyRequest(ids: string[], reqid: string): boolean {
  if (ids.includes(reqid)) {
    return true;
  } else {
    throw new Error("Wrong company id to update.");
  }
}

export const decodeToken = async (token: string) => {
  if (!token) throw new Error("No token");
  try {
    const hash = await getSecret();
    const decoded = jwt.verify(token, hash.demand.salt);
    return decoded;
  } catch {
    throw new Error("Unauthorized user");
  }
};
