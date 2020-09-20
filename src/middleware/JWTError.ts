import { NextFunction, Request, Response } from "express";
export const JWTError = () => {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === "UnauthorizedError") {
      res
        .status(401)
        .send({ success: false, error: "No authorization token found." });
    }
  };
};
