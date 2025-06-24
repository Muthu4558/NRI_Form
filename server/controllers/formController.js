import FormData from "../models/FormData.js";
import nodemailer from "nodemailer";

// POST /api/form/submit
export const submitForm = async (req, res) => {
  try {
    const formPayload = req.body;
    const savedForm = new FormData(formPayload);
    await savedForm.save();

    const { email, firstName } = formPayload;

    // Send confirmation email if email is provided
    if (email && process.env.MAIL_USER && process.env.MAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"NRI Enquiry" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Thank You for Your Enquiry",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;background:#f9f9f9;border-radius:10px;">
            <h2 style="color:#229ea6;">Hello ${firstName || "there"},</h2>
            <p>Thank you for submitting your enquiry through our NRI portal. Our expert will reach out to you shortly.</p>
            <p><strong>📞 Contact Number:</strong> 8148809313</p>
            <p>We’re available between <strong>10 AM - 8 PM IST</strong>.</p>
            <br>
            <p style="color:#888;">Warm regards,<br><strong>NRI Enquiry Team</strong></p>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Confirmation email sent to:", email);
      } catch (mailError) {
        console.warn("Email send failed:", mailError.message);
        // You may choose to log this to a monitoring service
      }
    }

    res.status(201).json({
      message: "Form submitted successfully.",
      emailSent: !!email,
      id: savedForm._id,
    });
  } catch (error) {
    console.error("Form submission error:", error);
    res.status(500).json({
      message: "Form submission failed",
      error: error.message,
    });
  }
};

// GET /api/form/all
export const getAllForms = async (_req, res) => {
  try {
    const forms = await FormData.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    console.error("Fetching forms error:", error);
    res.status(500).json({
      message: "Error fetching form data",
      error: error.message,
    });
  }
};
