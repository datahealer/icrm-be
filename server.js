import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./config/database.js";
import cookieParser from "cookie-parser";
import peopleRoutes from "./routes/peopleRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clientRoutes from "./routes/clientRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import purchaseItemRoutes from "./routes/purchaseItemRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import s3Routes from "./routes/s3Routes.js";
const app = express();

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connect();

// Middlewares
const corsOptions = {
  origin: 'https://main.d2q0ys24czjejd.amplifyapp.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true, // Allow cookies and Authorization headers
};

app.use(cors(corsOptions));

// Explicitly handle preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://main.d2q0ys24czjejd.amplifyapp.com');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Instead of bodyParser.urlencoded
app.use(cookieParser());


// Routes
app.use("/auth", userRoutes);
app.use("/profile", profileRoutes);
app.use("/s3", s3Routes);
app.use("/people", peopleRoutes);
app.use("/client", clientRoutes);
app.use("/project", projectRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/purchaseItems", purchaseItemRoutes);
app.use("/purchaseOrder", purchaseOrderRoutes);
app.use("/account", accountRoutes);
app.use("/dashboard", dashboardRoutes);

export const handler = serverless(app);
