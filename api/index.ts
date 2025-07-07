import app from "../src/app";
import serverless from "serverless-http";

// app;

export const handler = serverless(app);
