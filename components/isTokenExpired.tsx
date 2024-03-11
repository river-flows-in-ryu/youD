import jwt from "jsonwebtoken";

export default function isTokenExpired(value: string): boolean {
  try {
    const decode = jwt.decode(value);
    if (decode) {
      return decode.exp < Date.now() / 1000;
    } else {
      return true;
    }
  } catch {
    return true;
  }
}
