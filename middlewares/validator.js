import { validationResult } from "express-validator";

export const validator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.json({ message: errors.array()[0].msg });
  } else {
    next();
  }
};
