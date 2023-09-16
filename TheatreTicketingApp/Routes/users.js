const router = require("express").Router();
const jwt = require("jsonwebtoken");

const userData = require("../Models/user");

// signup
router.post("/signup", async (req, res) => {
  try {
    const existingUser = await userData.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists",
        message:
          "The requested username is already taken. Please choose a different one.",
      });
    }
    console.log(req.body);
    const newUser = userData(req.body);
    await newUser.save();
    res.status(200).json({ message: "Account created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable create account" });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  let user = await userData.findOne({ email: email });

  if (!user) res.json({ message: "User not found" });
  console.log(user);
  try {
    if (user.password === password) {
      jwt.sign(
        { email: user.email, id: user._id, role: user.role },
        "AwesomeMovies",
        { expiresIn: "1d" },
        (err, token) => {
          if (err) {
            res.json({ message: "token not generated" });
          } else {
            res.json({
              message: "Login Successfully",
              token: token,
              data: user,
            });
          }
        }
      );
    } else {
      res.json({ message: "Login failed" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
