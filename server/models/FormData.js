import mongoose from "mongoose";

const lovedOneSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  state: String,
  district: String,
  area: String,
  contact: String,
});

const formDataSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  lovedOnes: [lovedOneSchema],
}, { timestamps: true });

export default mongoose.model("FormData", formDataSchema);