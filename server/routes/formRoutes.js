import express from "express";
import { submitForm, getAllForms } from "../controllers/formController.js";

const router = express.Router();

router.post("/submit", submitForm);
router.get("/all", getAllForms); // <-- ✅ Added

export default router;
