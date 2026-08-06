import jwt from "jsonwebtoken";
import "dotenv/config";
import { AuthTokenPayload } from "../../types/authTokenPayload";

const secret = process.env.SECRET_KEY as string;

export function signToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function LoginToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, secret) as AuthTokenPayload;
}