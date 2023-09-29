const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);
  jwt.verify(token, "AwesomeMovies", (err, decoded) => {
    if (decoded && decoded.email) {
      req.body.role = decoded.role;

      next();
    } else {
      return res.json({ message: "Unauthorised user" });
    }
  });
};
module.exports = auth;
