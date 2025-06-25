import express from "express";
import {
  submitForm,
  getAllForms,
  updateForm,
  deleteForm,
} from "../controllers/formController.js";

const router = express.Router();

router.post("/submit", submitForm);
router.get("/all", getAllForms);
router.patch("/update/:id", updateForm);
router.delete("/delete/:id", deleteForm); // 👈 New delete route

export default router;
