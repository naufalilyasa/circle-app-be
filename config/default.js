export const port = parseInt(process.env.PORT || "3000");
export const accessTokenPrivateKey = process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY;
export const accessTokenPublicKey = process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
export const refreshTokenPrivateKey = process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY;
export const refreshTokenPublicKey = process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY;
export const redisCacheExpiresIn = 1440;
export const refreshTokenExpiresIn = 1440;
export const accessTokenExpiresIn = 60;
export const origin = "http://localhost:3000";
export const smtp = {
  host: process.env.EMAIL_HOST,
  pass: process.env.EMAIL_PASS,
  port: Number(process.env.EMAIL_PORT),
  user: process.env.EMAIL_USER
};
export const gmail = {
  googleAppPassword: process.env.GOOGLE_APP_PASSWORD,
  googleSenderMail: process.env.GOOGLE_SENDER_MAIL,
  googleUser: process.env.GOOGLE_USER
};