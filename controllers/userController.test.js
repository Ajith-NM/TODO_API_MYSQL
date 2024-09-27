import { expect, jest, test } from "@jest/globals";
import {
  auth,
  emailValidation,
  postAuthSignup,
  postSignup,
  forgetPassword,
  resetPassword,
  postLogin,
} from "./userController.js";
import * as service from "../services/userService.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cloudinaryUpload } from "../config/cloudinary.js";

describe("testing userController.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const options = { sameSite: "None", secure: true };

  test("@/user/Authentication-confirming authentication ", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await auth(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      msg: "alredy logged",
    });
  });

  test("@/user/emailVerification- verify email -success case", async () => {
    const req = {
      body: {
        otp: "12345678",
      },
      cookies: {
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const CheckUser = jest
      .spyOn(service, "CheckUser")
      .mockResolvedValue({ dataValues: { otp: "12345678" } });
    const UpdateOTP = jest.spyOn(service, "UpdateOTP");

    await emailValidation(req, res);
    expect(CheckUser).toHaveBeenCalledWith("example@gmail.com");
    expect(UpdateOTP).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      msg: "email verified successfully",
    });
  });
  test("@/user/emailVerification- verify email -failed case", async () => {
    const req = {
      body: {
        otp: "12345678",
      },
      cookies: {
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const CheckUser = jest
      .spyOn(service, "CheckUser")
      .mockRejectedValue("failed");

    await emailValidation(req, res);
    expect(CheckUser).toHaveBeenCalledWith("example@gmail.com");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      msg: "please enter correct otp",
    });
  });

  test("@ user/postSignup/Auth- postAuthSignup -- failed case", async () => {
    const req = {
      body: {
        picture: "http://profile.jpg",
        name: "John",
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const CheckUser = jest.spyOn(service, "CheckUser").mockResolvedValue(true);

    await postAuthSignup(req, res);
    expect(CheckUser).toHaveBeenCalledWith("example@gmail.com");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      msg: "email already exist",
    });
  });
  test("@ user/postSignup/Auth- postAuthSignup -- failed case", async () => {
    const req = {
      body: {
        picture: "http://profile.jpg",
        name: "John",
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const CheckUser = jest.spyOn(service, "CheckUser").mockRejectedValue(false);
    const GeneratePassword = jest
      .spyOn(service, "GeneratePassword")
      .mockReturnValue("12345678");
    const InsertUser = jest
      .spyOn(service, "InsertUser")
      .mockRejectedValue(false);

    await postAuthSignup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      msg: "failed to create user",
    });
  });
  test("@ user/postSignup/Auth- postAuthSignup -- success case", async () => {
    const req = {
      body: {
        picture: "http://profile.jpg",
        name: "John",
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const CheckUser = jest.spyOn(service, "CheckUser").mockRejectedValue(false);
    const GeneratePassword = jest
      .spyOn(service, "GeneratePassword")
      .mockReturnValue("12345678");
    const InsertUser = jest
      .spyOn(service, "InsertUser")
      .mockResolvedValue(true);
    const SendMail = jest.spyOn(service, "SendMail");

    await postAuthSignup(req, res);
    // expect(SendMail).resolves
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith(
      "email",
      "example@gmail.com",
      options
    );
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      msg: "new user created",
    });
  });

  test("@ /user/postSignup - postSignup -- Failed case", async () => {
    const req = {
      body: {
        password: "12345678",
        username: "Alex",
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const CheckUser = jest.spyOn(service, "CheckUser").mockResolvedValue(true);
    await postSignup(req, res);
    expect(CheckUser).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      msg: "email already exist",
    });
  });
  test("@ /user/postSignup - postSignup -- success case", async () => {
    const req = {
      body: {
        password: "12345678",
        username: "Alex",
        email: "example@gmail.com",
      },
      file: { path: ".assets/image.png" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const CheckUser = jest.spyOn(service, "CheckUser").mockResolvedValue(false);
    bcrypt.hash = jest.fn((password, saltRounds, callback) => {
      callback(null, "hashedPsd");
      return res.status(200).cookie("email", req.body.email,options).json({ status: true, msg: "new user created" });
    });
    cloudinaryUpload.uploader.upload=jest.fn().mockResolvedValue({secure_url:"http://image"})
       const InsertUser =jest.spyOn(service, "InsertUser").mockResolvedValue(true);
        const Otp=jest.spyOn(service,"GeneratePassword").mockReturnValue("12345678")
        const sendMail=jest.spyOn(service,"SendMail")
        await postSignup(req,res)
        expect(CheckUser).toHaveBeenCalled()
        expect(cloudinaryUpload.uploader.upload).toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.cookie).toHaveBeenCalledWith("email","example@gmail.com",options)
       expect(res.json).toHaveBeenCalledWith({ status: true, msg: "new user created" })
  });

  test("@ /user/forgetPassword - forgetPassword -- success case", async () => {
    const req = {
      body: {
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const GeneratePassword = jest
      .spyOn(service, "GeneratePassword")
      .mockReturnValue("12345678");
    const updateOTP = jest.spyOn(service, "UpdateOTP").mockResolvedValue(true);
    await forgetPassword(req, res);
    expect(updateOTP).toHaveBeenCalled();
    expect(GeneratePassword).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      msg: "verify your email by entering the otp",
    });
  });
  test("@ /user/forgetPassword - forgetPassword -- failed case", async () => {
    const req = {
      body: {
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const GeneratePassword = jest
      .spyOn(service, "GeneratePassword")
      .mockReturnValue("12345678");
    const updateOTP = jest.spyOn(service, "UpdateOTP").mockRejectedValue(false);
    await forgetPassword(req, res);
    expect(updateOTP).toHaveBeenCalled();
    expect(GeneratePassword).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      msg: "enter a valid email",
    });
  });

  test(" @ /user/resetPassword - resetPassword -- success case", async () => {
    const req = {
      body: {
        password: "12345678",
      },
      cookies: {
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const UpdatePassword = jest
      .spyOn(service, "UpdatePassword")
      .mockResolvedValue(true);
    const mockHashedPassword = "hashedPassword123";
    bcrypt.hash = jest.fn((password, saltRounds, callback) => {
      callback(null, mockHashedPassword);
      return res.status(200).json({ status: true, msg: "password updated" });
    });

    await resetPassword(req, res);
    expect(UpdatePassword).toHaveBeenCalledWith(
      "example@gmail.com",
      mockHashedPassword
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      msg: "password updated",
    });
  });
  test(" @ /user/resetPassword - resetPassword -- failed case", async () => {
    const req = {
      body: {
        password: "12345678",
      },
      cookies: {
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const UpdatePassword = jest
      .spyOn(service, "UpdatePassword")
      .mockRejectedValue(false);
    bcrypt.hash = jest.fn((password, saltRounds, callback) => {
      callback(null, null);
    });

    await resetPassword(req, res);
    expect(UpdatePassword).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      msg: "reset password failed",
    });
  });

  test("@ /user/postLogin- postLogin --Google Auth success case", async () => {
    const req = {
      body: {
        email: "example@gmail.com",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
    };
    const CheckUser = jest
      .spyOn(service, "CheckUser")
      .mockResolvedValue({ dataValues: { email: "example@gmail.com" } });
    jwt.sign = jest.fn((p1, p2, p3) => {
      return "123qwerty";
    });

    await postLogin(req, res);
    expect(CheckUser).toHaveBeenCalledWith("example@gmail.com");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith("token", "123qwerty", options);
  });
  test("@ /user/postLogin- postLogin --Manual login success case", async () => {
    const req = {
      body: {
        email: "example@gmail.com",
        password: "12345678",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
    };
    const CheckUser = jest
      .spyOn(service, "CheckUser")
      .mockResolvedValue({ dataValues: { email: "example@gmail.com" } });
    bcrypt.compare = jest.fn((password, saltRounds, callback) => {
      callback(null, true);
    });
    jwt.sign = jest.fn((p1, p2, p3) => {
      return "123qwerty";
    });

    await postLogin(req, res);
    expect(CheckUser).toHaveBeenCalledWith("example@gmail.com");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith("token", "123qwerty", options);
    expect(res.json).toHaveBeenCalledWith({
      status: true,
      user: { email: "example@gmail.com" },
    });
  });
  test("@ /user/postLogin- postLogin --failed case", async () => {
    const req = {
      body: {
        email: "example@gmail.com",
        password: "12345678",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
    };
    const CheckUser = jest.spyOn(service, "CheckUser").mockResolvedValue(false);
    await postLogin(req, res);
    expect(CheckUser).toHaveBeenCalledWith("example@gmail.com");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: false,
      msg: "email not match",
    });
  });
});
