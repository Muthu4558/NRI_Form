import FormData from "../models/FormData.js";
import nodemailer from "nodemailer";

// Form Submission Controller
export const submitForm = async (req, res) => {
  try {
    const newForm = new FormData(req.body);
    await newForm.save();

    // Destructure data for email
    const { email, firstName } = req.body;

    // Send confirmation email
    if (email) {
      // Setup mail transport
      const transporter = nodemailer.createTransport({
        service: "gmail", // or your preferred SMTP provider
        auth: {
          user: process.env.MAIL_USER, // Your email address
          pass: process.env.MAIL_PASS, // App password (not regular password)
        },
      });

      // Mail options
      const mailOptions = {
        from: `"NRI Enquiry" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Thank You for Your Enquiry",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;background:#f9f9f9;border-radius:10px;">
            <h2 style="color:#d81b60;">Hello ${firstName || "there"},</h2>
            <p>Thank you for submitting your enquiry on our NRI portal. Our expert will contact you shortly.</p>
            <p><strong>📞 Contact Number:</strong> 8148809313</p>
            <p>We are available between <strong>10 AM - 8 PM IST</strong>.</p>
            <br>
            <p style="color:#888;">Warm Regards,<br>NRI Enquiry Team</p>
          </div>
        `,
      };

      // Send mail
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({ message: "Form submitted and confirmation email sent!" });
  } catch (error) {
    console.error("Submission or mail error:", error);
    res.status(500).json({ message: "Form submission failed", error });
  }
};

// Optional: Get all forms
export const getAllForms = async (req, res) => {
  try {
    const forms = await FormData.find().sort({ createdAt: -1 });
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching forms", error });
  }
};