export default class AppError extends Error {
  status: string;
  isOpertional: boolean;
  constructor(public statusCode: number = 500, public message: string) {
    super(message);
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOpertional = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
