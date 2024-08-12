
import {  validationResult } from "express-validator";

//validation middleware errors.array()[0].msg
export  const validator = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
   console.log(validationResult(req));
    
    res.json({ message:errors.array()[0].msg })
  } else {
    next()
  }
}