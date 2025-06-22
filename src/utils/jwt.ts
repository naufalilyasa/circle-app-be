import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";

// const JWT_SECRET = process.env.JWT_SECRET as string;

export interface UserPayload {
  id: number;
  role: string;
}

export function signJwt(
  payload: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options: SignOptions
) {
  const privateKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  return jwt.sign(payload, privateKey, {
    ...options,
    allowInsecureKeySizes: true,
    algorithm: "RS256",
  });
}

export const verifyJwt = <T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null => {
  try {
    const publicKey = Buffer.from(
      config.get<string>(keyName),
      "base64"
    ).toString("ascii");
    const decoded = jwt.verify(token, publicKey) as T;
    return decoded;
  } catch (error) {
    return null;
  }
};
