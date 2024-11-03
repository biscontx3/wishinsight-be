import { Firestore } from "@google-cloud/firestore";
import { Collection } from "../enums/enums";
import Dotenv from "dotenv";
import { StatusError } from "../controllers/errors/StatusError";
import * as bcrypt from "bcrypt";
import { ResponseToken } from "../models/verifyAuth/ResponseToken";
import { getSecret } from "../middleware/secrets";
import jwt from "jsonwebtoken";
Dotenv.config();
const firestore = new Firestore();
const dbEnv = "demand-prod";
/**


/**
 * Create a new project submission from data.
 *
 * @param username username of admin.
 * @param password username of admin.
 * @param secret secret.
 * @returns ID of the project
 */
export async function login(
  username: string,
  password: string
): Promise<ResponseToken> {
  const userDoc = await firestore
    .collection(dbEnv)
    .doc(Collection.Metadata)
    .collection(Collection.Users)
    .doc(username)
    .get();

  if (!userDoc.exists) {
    throw new StatusError(401, "Unauthorized");
  }

  const userData = userDoc.data();

  const isValid = await bcrypt
    .compare(password, userData?.password)
    .then(function (result: any) {
      return result;
    });

  const hash = await getSecret();

  if (isValid && userData?.username === username) {
    const token = jwt.sign(
      {
        data: {
          username,
          loggedIn: new Date(),
        },
      },
      hash.demand.salt,
      { expiresIn: "1d" }
    );

    // const data = {
    //   token: token,
    //   created: new Date().toJSON(),
    // };

    return { token };
  } else {
    throw new StatusError(401, "Unauthorized");
  }
}
