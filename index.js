// index.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// optional: import helmet from "helmet"; import rateLimit from "express-rate-limit";

import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRouter from "./routes/orderRouter.js";

const app = express();

// middlewares
app.use(cors());
// prefer built-in parser
app.use(express.json());

// optional (recommended for prod)
// app.use(helmet());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 min

// JWT Middleware
// Two behaviours:
//  - default: if token present and invalid -> do NOT block public routes (log & continue).
//  - alternate (commented): return 401 on invalid token (strict).
app.use((req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) return next();

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    if (!token) return next();

    const secret = process.env.JWT_KEY || "chamo";
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        // ======= Option A (lenient): log and continue as anonymous =======
        console.warn("JWT invalid/expired - continuing as anonymous:", err.message);
        // if you prefer strict behavior, uncomment the next 2 lines and comment the `next()`:
        // console.warn("Invalid Token:", err.message);
        // return res.status(401).json({ message: "Invalid or expired token" });
        return next();

        // ======= Option B (strict): block request with 401 =======
        // if (err) return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded;
      return next();
    });
  } catch (err) {
    console.error("Auth middleware error:", err);
    return next();
  }
});

// Debugging
console.log("🟢 MONGODB_URL loaded:", process.env.MONGODB_URL ? "YES" : "NO");
console.log("🟢 JWT_KEY loaded:", process.env.JWT_KEY ? "YES" : "NO");

// basic global error handler (optional)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ message: "Internal Server Error" });
});

// start function
const start = async () => {
  const mongoUri = process.env.MONGODB_URL;
  if (!mongoUri) {
    console.error("❌ ERROR: MONGODB_URL missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      // modern mongoose ignores these but safe to include
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    // mount routes AFTER DB connected
    app.use("/products", productRouter);
    app.use("/users", userRouter);
    app.use("/orders", orderRouter);

    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message || err);
    process.exit(1);
  }
};

start();
