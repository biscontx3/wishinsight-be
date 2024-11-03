import { LoggingBunyan } from "@google-cloud/logging-bunyan";
import Bunyan from "bunyan";
// Creates a Bunyan Stackdriver Logging client
const loggingBunyan = new LoggingBunyan();
// Create a Bunyan logger that streams to Stackdriver Logging
// Logs will be written to: "projects/YOUR_PROJECT_ID/logs/bunyan_log”

const logger: Bunyan = Bunyan.createLogger({
  // The JSON payload of the log as it appears in Stackdriver Logging
  // will contain "name”: "my-service”
  name: "DemandSiteApi",
  streams: [
    // Log to the console at 'info' and above
    { stream: process.stdout, level: "info" },
    // And log to Stackdriver Logging, logging at 'info' and above
    loggingBunyan.stream("info"),
  ],
});
logger.emit = (rec: any, noemit: any) => {
  delete rec.hostname;
  delete rec.v;
  delete rec.pid;
  rec["message"] = rec.msg;
  delete rec.msg;
  return Bunyan.prototype.emit.call(logger, rec, noemit);
};

export default logger;
