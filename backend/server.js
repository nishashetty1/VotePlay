import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import teamRouter from "./routes/team.routes.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import certificateRouter from "./routes/certificate.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const allowedOrigins = [
  'https://voteplay.tech',
  'https://www.voteplay.tech',
  'https://voteplay-frontend.onrender.com',
  'http://localhost:5173',
];

// Middleware for handling CORS
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

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
app.use("/api", teamRouter);
app.use("/api", userRouter);
app.use("/api", authRouter);
app.use("/api", feedbackRouter);
app.use("/api", paymentRouter);
app.use("/api", certificateRouter);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   res.status(500).json({
//     success: false,
//     message: err.message || "Something went wrong!",
//   });
// });

// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({
//     success: false,
//     message: err.message || "Internal server error"
//   });
// });

// // Add this to your app.js for debugging
// app.get('/api/routes', (req, res) => {
//   const routes = [];
//   app._router.stack.forEach((middleware) => {
//     if (middleware.route) {
//       routes.push({
//         path: middleware.route.path,
//         methods: Object.keys(middleware.route.methods)
//       });
//     }
//   });
//   res.json(routes);
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// // Increase payload limit for JSON and URL-encoded data
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ 
//   limit: '50mb',
//   extended: true,
//   parameterLimit: 50000
// }));


// Connect to MongoDB
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running ${PORT}`);
});
