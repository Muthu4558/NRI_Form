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
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  lovedOnes: [lovedOneSchema],
  healthIssues: String,
  checklist: {
    diabetes: Boolean,
    bp: Boolean,
    heart: Boolean,
  },
}, { timestamps: true });

const FormData = mongoose.model("FormData", formDataSchema);
export default FormData;