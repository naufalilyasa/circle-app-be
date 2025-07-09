require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT || "3000"),
  accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
  refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
  refreshTokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
  redisCacheExpiresIn: 1440,
  refreshTokenExpiresIn: 1440,
  accessTokenExpiresIn: 60,
  origin: process.env.BASE_URL,
  frontendUrl: process.env.FRONTEND_URL,
  smtp: {
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
    port: Number(process.env.EMAIL_PORT),
    user: process.env.EMAIL_USER,
  },
  gmail: {
    googleAppPassword: process.env.GOOGLE_APP_PASSWORD,
    googleSenderMail: process.env.GOOGLE_SENDER_MAIL,
    googleUser: process.env.GOOGLE_USER,
  },
};
