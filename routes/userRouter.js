import express from "express";
const userRouter = express.Router();
import multer from "multer";
import { body } from "express-validator";
import { validator } from "../middlewares/validator.js";
import {
  emailValidation,
  forgetPassword,
  postLogin,
  postSignup,
  resetPassword,
} from "../controllers/userController.js";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

userRouter.post(
  "/postSignup",
  upload.single("image"),
  body("email").isEmail().withMessage("enter correct email"),
  body("username").not().isEmpty().withMessage("enter username"),
  body("password").not().isEmpty().withMessage("enter password"),
  validator,
  postSignup
);

userRouter.post(
  "/emailVerification",
  body("otp")
    .isLength({ min: 8, max: 8 })
    .withMessage("OTP must be 8 character"),
  validator,
  emailValidation
);

userRouter.post(
  "/postLogin",
  body("email").isEmail().withMessage("enter correct email"),
  body("password").not().isEmpty().withMessage("enter password"),
  validator,
  postLogin
);

userRouter.post(
  "/forgetPassword",
  body("email").isEmail().withMessage("enter correct email"),
  validator,
  forgetPassword
);

userRouter.put(
  "/resetPassword",
  body("password").not().isEmpty().withMessage("enter password"),
  validator,
  resetPassword
);

export default userRouter;
