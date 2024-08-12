
import jwt from "jsonwebtoken"

export const userAuthentication = (req, res, next) => {
    let token = req.cookies.token;
    if (token == undefined) {
      res.status(401).send("no token provided");
      return;
    }
  
    jwt.verify(token, process.env.secret, (err, decoded) => {
      if (err) {
        console.log(err);
        res.status(500).send("Authentication failed");
      } else {
       // console.log("decoded==",decoded);
          req.userId=decoded.user_Id
        next();
      }
    });
  };