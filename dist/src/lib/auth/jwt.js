import jwt from "jsonwebtoken";
import "dotenv/config";
const secret = process.env.SECRET_KEY;
export function signToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: "1d" });
}
export function LoginToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: "1d" });
}
export function verifyToken(token) {
    return jwt.verify(token, secret);
}
