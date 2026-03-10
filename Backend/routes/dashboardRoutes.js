import express from "express";
import { getSummary } from "../controllers/dashboardController.js";
import { downloadReport } from "../controllers/reportController.js";

const router = express.Router();

router.get("/summary", getSummary);
router.get("/report", downloadReport);   // ✅ new

export default router;
