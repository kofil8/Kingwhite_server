import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { generateToken } from "../../../utils/generateToken";

const loginUserFromDB = async (payload: {
  email: string;
  password: string;
  fcpmToken?: string;
}) => {
  // Find the user by email
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  // Check if the password is correct
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password as string
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  // Update the FCM token if provided
  if (payload?.fcpmToken) {
    await prisma.user.update({
      where: {
        email: payload.email, // Use email as the unique identifier for updating
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

  // Return user details and access token
  return {
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: userData.role,
    accessToken: accessToken,
  };
};

export const AuthServices = { loginUserFromDB };
