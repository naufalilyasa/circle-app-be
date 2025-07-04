import app from "../src/app";
import serverless from "serverless-http";

export const handler = serverless(app);
export const config = {
  // The maximum time the function can run before it is terminated
  timeout: 30, // seconds
};
