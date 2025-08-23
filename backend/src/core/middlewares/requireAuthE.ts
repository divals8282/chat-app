import { NextFunction, Request, Response } from "express";
import { decodeJWT } from "../decodeJWT";

export const requireAuthE = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authToken = request.headers.authorization;
  if (!authToken) {
    return response
      .status(401)
      .json({ message: "Authorization header missing" });
  }

  const { valid } = decodeJWT(authToken);
  if (valid) {
    return next();
  } else {
    return response.status(401).json({ message: "Invalid or expired token" });
  }
};
