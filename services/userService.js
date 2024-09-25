import { Users } from "../models/usermodel.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { where } from "sequelize";

dotenv.config();

// check user already login or not
export const CheckUser = async (email) => {
  return new Promise((resolve, reject) => {
    Users.findOne({ where: { email: email } })
      .then((data) => {
        resolve(data);
      })
      .catch(() => {
        reject("failed");
      });
  });
};

// insert a new user
export const InsertUser = async (name, email, url, otp ,password,) => {
  return new Promise((resolve, reject) => {
    Users.create({
      name: name,
      email: email,
      password: password,
      profilePic: url,
      otp: otp,
    })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};

//update a user field (otp)
export const UpdateOTP = async (email, otp) => {
  return new Promise((resolve, reject) => {
    Users.update({ otp: otp }, { where: { email: email } })
      .then((data) => {
        if (data[0]) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(false);
      });
  });
};

//update a user field (password)
export const UpdatePassword = async (email, password) => {
  return new Promise((resolve, reject) => {
    Users.update({ password: password }, { where: { email: email } })
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};

//random password/token generater
export const GeneratePassword = () => {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};

//send mail
export const SendMail = async (email, subject, text) => {
  let mailTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.password,
    },
  });

  let mailDetails = {
    from: process.env.email,
    to: email,
    subject: subject,
    text: text,
  };

  // mailTransport.sendMail(mailDetails, function (err, data) {
  //   if (err) {
  //     console.log("Error Occurs");
  //   } else {
  //     console.log("Email sent successfully");
  //   }
  // });
};
