import express from "express";
const userRouter = express.Router();
import multer from "multer";
import { body } from "express-validator";
import { validator } from "../middlewares/validator.js";
import {
  auth,
  emailValidation,
  forgetPassword,
  postAuthSignup,
  postLogin,
  postSignup,
  resetPassword,
} from "../controllers/userController.js";
import { userAuthentication } from "../middlewares/auth.js";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

userRouter.get(
  "/Authentication",
  userAuthentication,
  auth
);


userRouter.post(
  "/postSignup",
  upload.single("image"),
  body("email").isEmail().withMessage("enter correct email"),
  body("username").not().isEmpty().withMessage("enter username"),
  body("password").not().isEmpty().withMessage("enter password"),
  validator,
  postSignup
);
// picture, name, email
userRouter.post(
  "/postSignup/Auth",
  body("email").isEmail().withMessage("authentication failed"),
  body("name").not().isEmpty().withMessage("authentication failed"),
  body("picture").not().isEmpty().withMessage("authentication failed"),
  validator,
  postAuthSignup
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
  "/postLogin/Auth",
  body("email").isEmail().withMessage("enter correct email"),
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
