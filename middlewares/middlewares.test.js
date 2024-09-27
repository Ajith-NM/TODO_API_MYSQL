import { describe, expect, jest, test } from "@jest/globals";
import { userAuthentication } from "./auth.js";
import { validator } from "./validator.js";
import jwt from "jsonwebtoken";

describe("Testing auth.js & validator.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("testing auth.js failed ", async () => {
    const req = {
      cookies: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await userAuthentication(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toBeCalledWith({
      status: false,
      response: "failed",
      authError: true,
    });
  });
  test("testing auth.js success", async () => {
    const req = {
      cookies: {
        token: "token123456",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(false, "decoded value");
    });
    await userAuthentication(req, res, next);
    expect(next).toBeCalled()
  });
  test("testing auth.js success", async () => {
    const req = {
      cookies: {
        token: "token123456",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    jwt.verify = jest.fn((token, secret, callback) => {
      callback(true, "");
    });
    await userAuthentication(req, res, next);
    expect(next).not.toBeCalled()
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ status: false,response: "failed",authError:true})
  });

  test("testing validator.js", async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    await validator(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
