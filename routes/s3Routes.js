import express from "express";
import { generateUploadUrl } from "../controllers/s3Controller.js";
import { auth } from "../middleware/Auth.js";

const router = express.Router();

router.post("/create-upload-url", auth, generateUploadUrl);

export default router;
