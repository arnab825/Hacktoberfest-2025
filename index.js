// backend/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config();

// ✅ Express app setup
const app = express();
const PORT = process.env.PORT || 8080;

// ✅ ES module __dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Middleware
app.use(cors({
  origin: "http://localhost:5173",  // 🔁 Replace with your frontend URL in production
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ✅ Static file serving (e.g., product images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
import userRoutes from "./routes/index.js";
import productRoutes from "./routes/productRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/payment", paymentRoutes);  // Razorpay endpoints

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log("🟢 Razorpay Key:", process.env.RAZORPAY_KEY_ID); // Debug Razorpay env
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message || err);
    process.exit(1);
  });
