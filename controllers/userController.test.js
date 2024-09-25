import { expect, jest } from "@jest/globals";
import { auth, emailValidation,postAuthSignup } from "./userController";
import * as service from "../services/userService";
describe("testing userController.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
      cookies:{
        email:"example@gmail.com"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
      const CheckUser= jest.spyOn(service, "CheckUser").mockResolvedValue({dataValues:{otp:"12345678"}});
      const UpdateOTP = jest.spyOn(service, "UpdateOTP");

      await emailValidation(req, res);
      expect(CheckUser).toHaveBeenCalledWith("example@gmail.com")
      expect(UpdateOTP).toHaveBeenCalled()
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: true, msg: "email verified successfully" });
  })
  test("@/user/emailVerification- verify email -failed case", async () => {
    const req = {
      body: {
        otp: "12345678",
      },
      cookies:{
        email:"example@gmail.com"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
      const CheckUser= jest.spyOn(service, "CheckUser").mockRejectedValue("failed");

      await emailValidation(req, res);
      expect(CheckUser).toHaveBeenCalledWith("example@gmail.com")
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ status: false, msg: "please enter correct otp" });
  })

  test("@ user/postSignup/Auth- postAuthSignup -- failed case", async () => {
    const req = {
      body: {
        picture:"http://profile.jpg",
        name:"John",
        email:"example@gmail.com"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
      const CheckUser= jest.spyOn(service, "CheckUser").mockResolvedValue(true);

      await postAuthSignup(req, res);
      expect(CheckUser).toHaveBeenCalledWith("example@gmail.com")
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, msg: "email already exist" });
  })
  test("@ user/postSignup/Auth- postAuthSignup -- failed case", async () => {
    const req = {
      body: {
        picture:"http://profile.jpg",
        name:"John",
        email:"example@gmail.com"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
      const CheckUser = jest.spyOn(service, "CheckUser").mockRejectedValue(false);
      const GeneratePassword = jest.spyOn(service, "GeneratePassword").mockReturnValue("12345678");
      const InsertUser =jest.spyOn(service, "InsertUser").mockRejectedValue(false);

      await postAuthSignup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, msg: "failed to create user" });
  })
  test("@ user/postSignup/Auth- postAuthSignup -- success case", async () => {
    const req = {
      body: {
        picture:"http://profile.jpg",
        name:"John",
        email:"example@gmail.com"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
      const CheckUser = jest.spyOn(service, "CheckUser").mockRejectedValue(false);
      const GeneratePassword = jest.spyOn(service, "GeneratePassword").mockReturnValue("12345678");
      const InsertUser =jest.spyOn(service, "InsertUser").mockResolvedValue(true);
      const SendMail=jest.spyOn(service,"SendMail")

      await postAuthSignup(req, res);
      expect(SendMail).toHaveBeenCalledWith("example@gmail.com", "email verification", "12345678")
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: false, msg: "failed to create user" });
  })

});
