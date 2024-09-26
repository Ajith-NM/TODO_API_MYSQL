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

dotenv.config();
const options={sameSite: 'None',
  secure: true}

// @ user GoogleAuth Signup
// @ user/postSignup/Auth
export const postAuthSignup = async (req, res) => {
  try {
    let { picture, name, email } = req.body;

    let previousUser = await CheckUser(email)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });

    if (previousUser) {
      res.status(400).json({ status: false, msg: "email already exist" });
      return;
    } else {
      const otp = GeneratePassword();
      let user = await InsertUser(name, email, picture, otp)
        .then((data) => {
          return data;
        })
        .catch((err) => {
          console.log("error=", err);
          return err;
        });

      if (user) {
        await SendMail(email, "email verification", otp);
        res
          .status(200)
          .cookie("email", email,options)
          .json({ status: true, msg: "new user created" });
        return;
      } else {
        res.status(400).json({ status: false, msg: "failed to create user" });
        return;
      }
    }
  } catch (error) {
    console.log("error=", error);
    res.status(400).json({ status: false, msg: "something went wrong" });
  }
};

// @ userSignup
// @ /user/postSignup
export const postSignup = async (req, res) => {
  try {
    const saltRounds = 10;
    let { password, username, email } = req.body;
    let previousUser = await CheckUser(email)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });

    if (previousUser) {
      res.status(400).json({ status: false, msg: "email already exist" });
      return;
    } else {
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
            email,
            uploadResult.secure_url,
            otp,
            hash
          )
            .then((data) => {
              return data;
            })
            .catch((err) => {
              console.log("error=", err);
              return err;
            });

          if (user) {
            await SendMail(email, "email verification", otp);
            res
              .status(200)
              .cookie("email", email,options)
              .json({ status: true, msg: "new user created" });
            return;
          } else {
            res
              .status(400)
              .json({ status: false, msg: "failed to create user" });
            return;
          }
        }
      });
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: "something went wrong" });
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
      res
        .status(200)
        .json({ status: true, msg: "email verified successfully" });
      return;
    } else {
      res.status(401).json({ status: false, msg: "please enter correct otp" });
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: "something went wrong" });
  }
};

// @  user login
// @ /user/postLogin
export const postLogin = async (req, res) => {
  try {
    const { email, password = 0 } = req.body;
    const user = await CheckUser(email)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log("err", err);
      });
    const loginProcess = () => {
      let token = jwt.sign(user.dataValues, process.env.secret, {
        expiresIn: "1d",
      });
      res
        .cookie("token", token,options)
        .status(200)
        .json({ status: true, user: user.dataValues });
      return;
    };
    if (password&&user) {
      bcrypt.compare(password, user.dataValues.password, (err, result) => {
        if (result) {
          loginProcess();
          return;
        }
        console.log(err);
        return res
          .status(401)
          .json({ status: false, msg: "password not match" });
      });
    } else if (user) {
      loginProcess();
      return;
    } else {
    return  res.status(401).json({ status: false, msg: "email not match" });
    }
  } catch (error) {
    console.log(error);

    res.status(400).json({ status: false, msg: "something went wrong" });
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

    if (update) {
      await SendMail(email, "email verification", newOTP);
      res
        .status(200)
        .cookie("email", email,options)
        .json({ status: true, msg: "verify your email by entering the otp" });
    } else {
      res.status(400).json({ status: false, msg: "enter a valid email" });
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: "something went wrong" });
  }
};

// @  resetting password
// @ /user/resetPassword
export const resetPassword = async (req, res) => {
  try {
    const saltRounds = 10;
    const password = req.body.password;
    const email = req.cookies.email;
    bcrypt.hash (password, saltRounds, async (err, hash) => {
      if (hash) {
        const updatedPassword = await UpdatePassword(email, hash)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            console.log("err", err);
          })
        updatedPassword? res.status(200).json({ status: updatedPassword, msg: "password updated" }): "";
      }
      return res
        .status(400)
        .json({ status: false, msg: "reset password failed" });
    });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

// @  checking the user is already logged or not
// @ /user/Authentication
export const auth=async(req,res)=>{
 res.status(200).json({status:true,msg:"alredy logged"});

}