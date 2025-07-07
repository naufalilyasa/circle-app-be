"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: parseInt(process.env.PORT || "3000"),
    accessTokenPrivateKey: process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    accessTokenPublicKey: process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    refreshTokenPrivateKey: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
    refreshTokenPublicKey: process.env.JWT_REFRESH_TOKEN_PUBLIC_KEY,
    // 60
    redisCacheExpiresIn: 1440,
    // 60
    refreshTokenExpiresIn: 1440,
    // 15
    accessTokenExpiresIn: 60,
    origin: "http://localhost:3000",
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
//# sourceMappingURL=default.js.map