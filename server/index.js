import prisma from "./prisma/client.js";
import express from "express";
import corsPkg from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/account.js";
import auth from "./middleware/auth.js";


const cors = corsPkg;

dotenv.config();

const app = express();

// ✅ CORS (working with ESM)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);

// Health check
app.get("/api/health", auth, async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({
      status: "OK",
      db: "connected",
      usersCount: users.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

