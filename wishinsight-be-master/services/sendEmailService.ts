import { StatusError } from "../controllers/errors/StatusError";
import nodemailer from "nodemailer";
import * as fs from "fs";
import * as path from "path";
import handlebars from "handlebars";
// @ts-ignore
import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import Dotenv from "dotenv";
import logger from "../logger";
import { google } from "googleapis";
import { getSecret } from "../middleware/secrets";
Dotenv.config();
function readHtmlFile(htmlPath: string) {
  let html = "";
  try {
    html = fs.readFileSync(path.join(process.cwd(), htmlPath), "utf-8");
  } catch (error) {
    logger.error(error, "SendEmailRequest readHtmlFile failed");
  }
  return html;
}

/**
 * Create a new project submission from data.
 *
 * @returns all submitted projects
 */
export async function sendEmailService(emailData: any) {
  const secret = await getSecret();

  //@ts-ignore
  const secretPW: any = secret.Remote.emailPassword;

  try {
    const transporter = nodemailer.createTransport({
      //@ts-ignore
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "info@remotejobseu.com",
        pass: secretPW,
      },
    });
    const emailType = emailData.type;
    let formattedMail = "";
    switch (emailType) {
      case "subscribe":
        // /dist/src/approved.html
        const subscribe = readHtmlFile(`/dist/src/approved.html`);
        const subscribeTemplate = handlebars.compile(subscribe);
        formattedMail = subscribeTemplate({
          id: emailData.id,
        });
        break;

      case "approvedListing":
        const approveListing = readHtmlFile(
          `/dist/src/approvedJobListing.html`
        );
        const approveListingTemplate = handlebars.compile(approveListing);
        formattedMail = approveListingTemplate({
          name: emailData.name,
        });
        break;

      case "inviteUser":
        const inviteUser = readHtmlFile(`/dist/src/inviteUser.html`);
        const inviteUserTemplate = handlebars.compile(inviteUser);
        formattedMail = inviteUserTemplate({
          password: emailData.password,
          username: emailData.username,
          url: emailData.url,
        });
        break;

      case "pendingSubmissionAdmin":
        const pendingSubmissionAdmin = readHtmlFile(
          `/dist/src/pendingAdminEmail.html`
        );
        const pendingSubmissionAdminTemplate = handlebars.compile(
          pendingSubmissionAdmin
        );
        formattedMail = pendingSubmissionAdminTemplate({});
        break;

      default:
        break;
    }

    const recipient: string = emailData.recipient;

    const data: any = {
      from: "info@remotejobseu.com",
      to: recipient ? recipient : "delshadk1@gmail.com",
      subject: "Update - Remote Jobs In Eu",
      html: formattedMail,
    };

    const payload = data;
    const res = await transporter.sendMail(payload);

    if (res) {
      return true;
    } else {
      console.log("Failed get response");
    }
  } catch (error) {
    logger.error(error, "request failed");
    console.log("Failed enter mailservice");
  }
}
