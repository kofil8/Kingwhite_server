import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import emailTemplet from "../../../helpars/emailtemplet";
import { jwtHelpers } from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";

const login = async (payload: { email: string; password: string }) => {
  // Find the user using either email or username
  console.log(payload);

  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  console.log("heelo");

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Ensure a password is provided and exists in the user record
  if (!payload.password || !userData?.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");
  }

  // Verify the password
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "credentials are not matched");
  }

  // Generate JWT token
  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  return { accessToken, role: userData.role };
};

const getMyProfile = async (id: string) => {
  const userProfile = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!userProfile) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return userProfile;
};

// change password
const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  // console.log(userToken, newPassword, oldPassword);
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user || !user?.password) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user?.password);

  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect crendentials");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return { message: "Password changed successfully" };
};

// forgot password
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const resetPassToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );
  console.log(config.reset_pass_link);
  const resetPassLink =
    config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`;

  emailTemplet(userData.email, resetPassLink);

  return {
    message: "Reset password link sent via your email successfully",
  };
};

// reset password
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  console.log(180, payload.id);
  const userData = await prisma.user.findUnique({
    where: {
      id: payload.id,
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  let isValidToken;
  console.log(token);
  try {
    isValidToken = jwtHelpers.verifyToken(
      token,
      config.jwt.reset_pass_secret as Secret
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid token signature");
  }

  if (!isValidToken) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!");
  }

  const password = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: {
      password,
    },
  });
  return { message: "Password reset successfully" };
};

// logout
const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isOnline: false,
    },
  });
  return;
};

export const AuthServices = {
  login,
  logoutUser,
  getMyProfile,
  changePassword,
  forgotPassword,
  resetPassword,
};
