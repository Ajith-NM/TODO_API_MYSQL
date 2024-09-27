import { validationResult } from "express-validator";

export const validator = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ status: false, msg: errors.array()[0].msg });
  } else {
    next();
  }
};
