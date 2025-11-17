// controllers/userController.js
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Create new user
export async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Only admin can create admin accounts
    if (role === "admin") {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Not authorized to create admin" });
      }
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashed,
      role: role || "customer",
    });

    await user.save();
    return res.status(201).json({ message: "User created successfully" });

  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Login
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        img: user.img
      },
      process.env.JWT_KEY || "chamo",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role
    });

  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Check admin
export function isAdmin(req) {
  return !!(req?.user && req.user.role === "admin");
}

// Admin-only middleware
export function requireAdmin(req, res, next) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
