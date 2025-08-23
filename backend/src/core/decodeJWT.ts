import jwt from "jsonwebtoken";

export interface DecodedTokenI {
  id: string;
  nickname: string;
  email: string;
}

export const decodeJWT = (
  token: string
): {
  valid: boolean;
  decoded: DecodedTokenI | null;
} => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY as string
    ) as DecodedTokenI;
    return { valid: true, decoded };
  } catch (error) {
    return { valid: false, decoded: null };
  }
};
