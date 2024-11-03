import express, { Application } from "express";
import path from "path";
import Compression from "compression";
import helmet from "helmet";
import cors from "cors";
import Routes from "./routes";
import Dotenv from "dotenv";
import logger from "./logger";
import requestIp from "request-ip";
import { getSecret } from "./middleware/secrets";
import cookieParser from "cookie-parser";
export default async function server(): Promise<Application> {
  const app: any = express();

  Dotenv.config();
  let whitelist: Array<string>;
  //hope this works
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    whitelist = [
      "https://api.wishinsight.com",
      "https://wishinsight.com",
      "https://www.wishinsight.com",
      "https://www.api.wishinsight.com",
    ];
  } else {
    whitelist = ["https://wishinsight.com", "http://localhost:3000"];
  }
  const secret = await getSecret();
  app.use(cookieParser(secret.demand.salt));
  app.use(helmet());
  app.use(requestIp.mw());
  app.use(
    express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
  );
  app.use(Compression());
  app.use(
    cors({
      origin: whitelist,
      methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Access-Control-Allow-Credentials",
        "Access-Control-Allow-Headers",
        "Authorization",
      ],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: false }));
  //config for proxt
  app.enable("trust proxy");

  Routes(app);
  return app;
}
