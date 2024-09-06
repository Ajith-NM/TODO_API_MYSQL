import jwt from "jsonwebtoken";

export const userAuthentication = (req, res, next) => {
  let token = req.cookies.token;
  if (token == undefined) {
    res.status(401).json({ status: false,response: "failed"});
    return;
  }

  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(400).json({ status: false,response: "failed"});
    } else {
      req.userId = decoded.user_Id;
      next();
    }
  });
};
