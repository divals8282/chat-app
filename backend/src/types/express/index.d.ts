import "express";

declare module "express-serve-static-core" {
  interface Request {
    authUser?: {
      id: string;
      nickname: string;
      email: string;
    };
  }
}
