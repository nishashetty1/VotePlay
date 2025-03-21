import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import certificateRouter from "./routes/certificate.routes.js";
import categoryRouter from "./routes/category.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = [
  'https://voteplay.tech',
  'https://www.voteplay.tech',
  'https://voteplay-frontend.onrender.com'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ 
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", feedbackRouter);
app.use("/api", paymentRouter);
app.use("/api", certificateRouter);
app.use("/api", categoryRouter);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI, {
    dbName: "voting_simulator",
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;