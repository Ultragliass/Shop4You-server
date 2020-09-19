import { JWTRequest } from "../models/JWTRequest";
import { Response, NextFunction } from "express";

export const validateAdmin = () => {
  return (req: JWTRequest, res: Response, next: NextFunction) => {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        msg: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};
