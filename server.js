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
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Instead of bodyParser.urlencoded
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

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
