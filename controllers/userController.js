import { Users } from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { cloudinaryUpload } from "../config/cloudinary.js";
import {
  CheckUser,
  GeneratePassword,
  InsertUser,
  SendMail,
  UpdateOTP,
  UpdatePassword,
} from "../services/userService.js";
import { response } from "express";

dotenv.config();

// @ userSignup
// @ /user/postSignup
export const postSignup = async (req, res) => {
  try {
    const saltRounds = 10;
    let { password, username, email } = req.body;
    let previousUser = await CheckUser(email);

    if (previousUser === null) {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (hash) {
          const uploadResult = await cloudinaryUpload.uploader
            .upload(req.file.path, {
              public_id: `upload/${req.file.path}`,
            })
            .then((data) => {
              return data;
            })
            .catch((error) => {
              console.log(error);
            });
          let otp = GeneratePassword();

          let user = await InsertUser(
            username,
            hash,
            email,
            uploadResult.secure_url,
            otp
          )
            .then((data) => {
              return data;
            })
            .catch((err) => {
              console.log("error=", err);
            });

          if (user != "failed") {
            await SendMail(email, "email verification", otp);
            res.status(200).cookie("email", email).json({ user: user });
            return;
          } else {
            res.status(500).send("failed to create user");
            return;
          }
        }
      });
    } else {
      res.send("USER already exist");
      return;
    }
  } catch (error) {
    res.send("failed");
    console.log("error=", error);
  }
};

// @ emailVerification
// @ /user/emailVerification
export const emailValidation = async (req, res) => {
  try {
    const enterdOTP = req.body.otp;
    const originalOTP = await CheckUser(req.cookies.email)
      .then((data) => {
        return data.dataValues.otp;
      })
      .catch((err) => {
        console.log("verification err=", err);
      });

    if (enterdOTP === originalOTP) {
      await UpdateOTP(req.cookies.email, null);
      res.status(200).json({ result: "email verified successfully" });
      return;
    } else {
      res.status(401).json({ result: "please enter correct otp" });
    }
  } catch (error) {
    res.json({ res: error });
  }
};

// @  user login
// @ /user/postLogin
export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await CheckUser(email)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("err", err);
      });
    if (user !== null) {
      bcrypt.compare(password, user.dataValues.password, (err, result) => {
        if (result) {
          let token = jwt.sign(user.dataValues, process.env.secret, {
            expiresIn: 8640000,
          });
          res
            .cookie("token", token)
            .status(200)
            .json({ status: "success", user: user.dataValues });
          return;
        }
        console.log(err);
        return res.status(401).send(" password not match");
      });
    } else {
      res.status(400).json({ response: "email not match" });
    }
  } catch (error) {
    res.json({ error: error });
  }
};

// @  forget password entering email  for generating otp and send it through mail
// @ /user/forgetPassword
export const forgetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const newOTP = GeneratePassword();
    const update = await UpdateOTP(email, newOTP)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("err", err);
      });

    if (update === "updated") {
      await SendMail(email, "email verification", newOTP);
      res
        .status(200)
        .cookie("email", email)
        .json({ response: "verify your email by entering the otp" });
    } else {
      res.json({ response: "enter a valid email" });
    }
  } catch (error) {
    res.json({ error: error });
  }
};

// @  resetting password
// @ /user/resetPassword
export const resetPassword = async (req, res) => {
  try {
    const saltRounds = 10;
    const password = req.body.password;
    const email = req.cookies.email;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (hash) {
        const updatedPassword = await UpdatePassword(email, hash)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log("err", err);
          });

        return res.status(200).json({ response: updatedPassword });
      }
      return res.json({ response: "reset password failed" });
    });
  } catch (error) {
    res.json({ error: error });
  }
};
