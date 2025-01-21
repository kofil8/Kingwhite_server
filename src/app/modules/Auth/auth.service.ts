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

  const emailSubject = "OTP Verification for Login";

  // Plain text version
  const emailText = `Your OTP is: ${otp}`;

  const textForLogin = `Welcome back! Please use the following OTP to login to your account`;

  // HTML content for the email design
  const emailHTML = emailTemplate(otp, textForLogin);

  // Send email with both plain text and HTML
  await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);

  // Set OTP expiry date (e.g., 10 minutes from now)
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.create({
    data: {
      email: payload.email,
      otp,
      expiry: otpExpiry,
    },
  });

  // Return user details and access token
  return "Please check your email for OTP";
};

const logoutUser = async (id: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  if (userData.isOnline === false) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is already logged out");
  }

  await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isOnline: false,
      fcmToken: null,
    },
  });
  return;
};

export const AuthServices = { loginUserFromDB, logoutUser };
