const User = require("../../database/model/user.model");
const jwt = require("jsonwebtoken");
const validator = require("email-validator");

const signin = async (req, res) => {
  let { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, "kljclsadflkdsjfklsdjfklsdjf", {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Sign-in successful", token, user });
  } catch (error) {
    return res.status(400).send("login failed");
  }
};

const register = async (req, res) => {
  console.log(req.body, "req");
  const { username, password, email } = req.body;
  try {
    if (!username)
      return res
        .status(400)
        .json({ message: "username is required", error: true });

    if (!email)
      return res
        .status(400)
        .json({ message: "email is required", error: true });

    if (!validator.validate(email)) {
      return res
        .status(400)
        .json({ message: "enter valid email id", error: true });
    }
    if (!password || password.length < 6) {
      return res.status(400).send("enter valid password");
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(400)
        .json({ message: "User already exists", error: true });

    const user = await new User({
      email,
      username,
      password,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  signin,
  register,
};
