import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { emailTemplate } from "../../../helpars/emailtempForOTP";
import sentEmailUtility from "../../../utils/sentEmailUtility";
import config from "../../../config";
import { generateToken } from "../../../utils/generateToken";
import { Secret } from "jsonwebtoken";

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

  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

  const textForLogin = `Welcome back! Please use the following OTP to login to your account`;

  // HTML content for the email design
  const emailHTML = emailTemplate(otp, textForLogin);

  // Send email with both plain text and HTML
  await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);

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

const verifyOtpLogin = async (payload: {
  fcpmToken?: string;
  email: string;
  otp: number;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  const otpData = await prisma.otp.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (otpData?.otp !== payload.otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  if (otpData?.expiry < new Date()) {
    throw new ApiError(httpStatus.BAD_REQUEST, "OTP has expired");
  }

  if (userData.status !== "ACTIVE") {
    await prisma.user.update({
      where: {
        id: userData.id,
      },
      data: {
        status: "ACTIVE",
        isOnline: true,
      },
    });
  }

  await prisma.otp.delete({
    where: {
      id: otpData.id,
    },
  });

  if (payload?.fcpmToken) {
    await prisma.user.update({
      where: {
        email: payload.email,
      },
      data: {
        fcmToken: payload.fcpmToken,
      },
    });
  }

  // Generate an access token
  const accessToken = generateToken(
    {
      id: userData.id,
      email: userData.email as string,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    message: "OTP verified successfully",
    accessToken,
  };
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

export const AuthServices = { loginUserFromDB, logoutUser, verifyOtpLogin };
