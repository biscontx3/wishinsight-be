import {
  Firestore,
  DocumentSnapshot,
  Query,
  FieldValue,
  Timestamp,
  CollectionGroup,
} from "@google-cloud/firestore";
import { randomUUID } from "crypto";

import { StatusError } from "../controllers/errors/StatusError";
import { Collection } from "../enums/enums";
import Dotenv from "dotenv";
import { GraphQLClient, gql } from "graphql-request";
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { start } from "repl";
import { convertDateToTimestamp } from "../middleware/utils";
import { sendEmailService } from "./sendEmailService";

Dotenv.config();
const client = new SecretManagerServiceClient();
const firestore = new Firestore();
const dbEnv =
  process.env.ENVIRONMENT === "production" ? "remote-prod" : "remote-dev";
