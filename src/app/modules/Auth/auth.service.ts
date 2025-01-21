import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { emailTemplate } from "../../../helpars/emailtempForOTP";
import sentEmailUtility from "../../../utils/sentEmailUtility";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  // Find the user by email
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  // Check if the password is correct
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid credentials");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  const emailSubject = "OTP Verification for Registration";

  // Plain text version
  const emailText = `Your OTP is: ${otp}`;

  const textForLogin = `Welcome back, ${userData.firstName}! Please use the following OTP to login to your account`;

  // HTML content for the email design
  const emailHTML = emailTemplate(otp, textForLogin);

  // Send email with both plain text and HTML
  await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);

  await prisma.otp.create({
    data: {
      email: payload.email,
      otp,
    },
  });

  // Return user details and access token
  return "Please check your email for OTP";
};

export const AuthServices = { loginUserFromDB };
