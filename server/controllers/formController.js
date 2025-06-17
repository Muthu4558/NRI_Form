import FormData from "../models/FormData.js";

export const submitForm = async (req, res) => {
  try {
    // console.log("Submitted form data:", JSON.stringify(req.body, null, 2)); // 👈 Check this!
    const newForm = new FormData(req.body);
    await newForm.save();
    res.status(201).json({ message: "Form submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Form submission failed", error });
  }
};

export const getAllForms = async (req, res) => {
  try {
    const forms = await FormData.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms", error });
  }
};
