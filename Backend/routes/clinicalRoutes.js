import express from "express";
import multer from "multer";
import {
  analyzeText,
  analyzePDF,
  healthCheck
} from "../controllers/clinical.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/health", healthCheck);
router.post("/analyze/text", analyzeText);
router.post("/analyze/pdf", upload.single("pdf"), analyzePDF);

export default router;
