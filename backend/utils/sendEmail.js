import nodemailer from "nodemailer";


/**
 * Creates and returns a Nodemailer SMTP transporter.
 */
const createTransporter = () => {
  const service = process.env.EMAIL_SERVICE || "gmail";
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (service.toLowerCase() === "gmail") {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587", 10),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a 6-digit OTP verification email to the specified recipient.
 */
export const sendOtpEmail = async (toEmail, otpCode) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      "⚠️ WARNING: EMAIL_USER or EMAIL_PASS environment variables are missing! Email sending may fail."
    );
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"CourtHub Sports Booking" <${process.env.EMAIL_USER || "noreply@courthub.com"}>`,
    to: toEmail,
    subject: "Your Registration OTP Code - CourtHub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #059669; margin: 0;">CourtHub Verification</h2>
          <p style="color: #64748b; font-size: 14px;">Sports Court Booking System</p>
        </div>
        <div style="padding: 16px; background-color: #f0fdf4; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <p style="font-size: 14px; color: #166534; margin-bottom: 8px;">Your 6-Digit Email Verification Code is:</p>
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #047857; display: inline-block; padding: 8px 16px; background: #ffffff; border: 1px dashed #059669; border-radius: 6px;">
            ${otpCode}
          </span>
          <p style="font-size: 12px; color: #64748b; margin-top: 12px;">This OTP will expire in <strong>10 minutes</strong>.</p>
        </div>
        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 0;">
          If you did not request this verification, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Nodemailer sendMail Error:", error.message);
    throw new Error(
      "Failed to send verification email. Please check that the email address is valid."
    );
  }
};
