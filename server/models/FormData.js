import mongoose from "mongoose";

const lovedOneSchema = new mongoose.Schema({
  name: String,
  age: String,
  gender: String,
  city: String,
  contact: String,
});

const formDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  familyCount: String,
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
