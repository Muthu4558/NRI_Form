import mongoose from "mongoose";

const lovedOneSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  state: String,
  district: String,
  area: String,
  contact: String,
  healthConcerns: [String], // <-- Add this line
});

const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  healthIssues: String,
  lovedOnes: [lovedOneSchema],
  remark: String,
  statusEmail: { type: String, default: "Pending" },
  statusWhatsapp: { type: String, default: "Pending" },
  statusPhone: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.model("FormData", formDataSchema);