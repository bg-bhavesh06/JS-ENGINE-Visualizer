const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_js_engine_visualizer_key_998811";

const signUp = async (req, res) => {
  const { username, email, password } = req.body || {};

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return res.status(400).json({ message: "All fields must be valid strings." });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({ message: "Username must be at least 3 characters." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Username or email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("[signup-error]", error);
    return res.status(500).json({ message: "Failed to register user." });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password must be valid strings." });
  }

  try {
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email/username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/username or password." });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[login-error]", error);
    return res.status(500).json({ message: "Failed to log in." });
  }
};

module.exports = {
  signUp,
  login,
};
