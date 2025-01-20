import { env } from "process";
import nodemailer from "nodemailer";
import smtpTransporter from "nodemailer-smtp-transport";

let sentEmailUtility = async (
  emailTo: string,
  EmailSubject: string,
  EmailText: string,
  EmailHTML: string // HTML content as a parameter
) => {
  let transporter = nodemailer.createTransport(
    smtpTransporter({
      service: "Gmail",
      auth: {
        user: "jahidhasanbabu7821@gmail.com",
        pass: env.EMAIL_PASSWORD,
      },
    })
  );

  let mailOption = {
    from: "Demo Service <no-reply@gmail.com>",
    to: emailTo,
    subject: EmailSubject,
    text: EmailText, // Optional: Add for plain text fallback
    html: EmailHTML, // HTML content
  };

  return await transporter.sendMail(mailOption);
};

export default sentEmailUtility;
