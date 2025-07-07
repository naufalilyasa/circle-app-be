import { cleanEnv, port, str } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    POSTGRES_HOST: str(),
    POSTGRES_URL: str(),
    EMAIL_USER: str(),
    EMAIL_PASS: str(),
    EMAIL_HOST: str(),
    EMAIL_PORT: port(),
    GOOGLE_APP_PASSWORD: str(),
    GOOGLE_USER: str(),
    GOOGLE_SENDER_MAIL: str(),
    REDIS_URL: str(),
  });
};

export default validateEnv;
