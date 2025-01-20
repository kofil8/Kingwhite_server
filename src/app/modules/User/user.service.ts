import { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import ApiError from "../../../errors/ApiErrors";
import { generateToken } from "../../../utils/generateToken";
import prisma from "../../../shared/prisma";
import sentEmailUtility from "../../../utils/sentEmailUtility";

interface UserWithOptionalPassword extends Omit<User, "password"> {
  password?: string;
}

const registerUserIntoDB = async (payload: any) => {
  const hashedPassword: string = await bcrypt.hash(payload.password, 12);

  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const accessToken = generateToken(
    {
      id: user.id,
      email: user.email as string,
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    status: user.status,
    accessToken: accessToken,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const getAllUsersFromDB = async () => {
  const result = await prisma.user.findMany({
    where: {
      status: "ACTIVE",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

const getMyProfileFromDB = async (id: string) => {
  const Profile = await prisma.user.findUniqueOrThrow({
    where: {
      id: id,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Profile;
};

const getUserDetailsFromDB = async (id: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: "ACTIVE",
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

const updateMyProfileIntoDB = async (id: string, payload: any, file: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  // Handle profile image upload
  const profileImage = file?.originalname
    ? `${process.env.BACKEND_BASE_URL}/uploads/${file.originalname}`
    : existingUser.profileImage;

  // Prepare the updated data object
  const updatedData = {
    ...payload, // Include fields from payload
    profileImage, // Update or retain profile image
  };

  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: updatedData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return result;
};

const updateUserRoleStatusIntoDB = async (id: string, payload: any) => {
  const result = await prisma.user.update({
    where: {
      id: id,
    },
    data: payload,
  });
  return result;
};

// const deleteUser = async (id: string) => {
//   const existingUser = await prisma.user.findUnique({
//     where: { id },
//   });

//   if (!existingUser) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
//   }
//   const result = await prisma.user.update({
//     where: {
//       id: id,
//     },
//     data: {
//       status: "INACTIVE",
//     },
//   });
//   return;
// };

const deleteUser = async (id: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const result = await prisma.user.delete({
    where: {
      id: id,
    },
  });
  return;
};

const forgotPassword = async (payload: { email: string }) => {
  // Check if the user exists
  const userData = await prisma.user.findUnique({
    where: { email: payload.email, status: "ACTIVE" },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  const emailSubject = "OTP Verification";

  // Plain text version
  const emailText = `Your OTP is: ${otp}`;

  // HTML content for the email design
  const emailHTML = `
    <table cellpadding="0" cellspacing="0" align="center" style="width:100%; table-layout:fixed; background-color:#f5f5f5;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" style="background-color:#ffffff; width:600px; border-collapse:collapse;">
                    <tr>
                        <td align="center" style="padding:30px 20px;">
                            <img src="https://i.ibb.co/yVsctTq/file-1.png" alt="Logo" width="200" style="display:block; border:0;"/>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:10px 20px;">
                            <h3 style="margin:0; font-family:'Arial', sans-serif; font-size:46px; font-weight:bold; color:#333;">
                                Reset Password
                            </h3>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:5px 40px;">
                            <p style="margin:0; font-family:'Arial', sans-serif; font-size:14px; color:#333;">
                                We received a request to reset your UIPtv Account password.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding:10px 20px;">
                            <table cellpadding="0" cellspacing="0" style="width:100%; border:2px dashed #ccc; border-radius:5px;">
                                <tr>
                                    <td align="center" style="padding:20px;">
                                        <h3 style="margin:0; font-family:'Arial', sans-serif; font-size:26px; font-weight:bold; color:#333;">
                                            Your verification code is:
                                        </h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding:10px 20px;">
                                        <h1 style="margin:0; font-family:'Arial', sans-serif; font-size:46px; font-weight:bold; color:#5c68e2;">
                                            ${otp}
                                        </h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`;

  // Send email with both plain text and HTML
  await sentEmailUtility(payload.email, emailSubject, emailText, emailHTML);

  // Check if OTP already exists for the user
  const existingOtp = await prisma.otp.findFirst({
    where: { email: payload.email },
  });

  if (existingOtp) {
    await prisma.otp.update({
      where: {
        id: existingOtp.id,
      },
      data: {
        otp,
      },
    });
  } else {
    await prisma.otp.create({
      data: {
        email: payload.email,
        otp,
      },
    });
  }
};

const verifyOtp = async (payload: { email: string; otp: number }) => {
  // Check if the user exists
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }

  // Check if the OTP is valid
  const otpData = await prisma.otp.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (otpData?.otp !== payload.otp) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  // Remove the OTP after successful verification
  await prisma.otp.delete({
    where: {
      id: otpData.id,
    },
  });

  return;
};

const changePassword = async (payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: "ACTIVE",
    },
  });

  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      id: userData.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return;
};

export const UserServices = {
  registerUserIntoDB,
  getAllUsersFromDB,
  getMyProfileFromDB,
  getUserDetailsFromDB,
  updateMyProfileIntoDB,
  updateUserRoleStatusIntoDB,
  deleteUser,
  forgotPassword,
  verifyOtp,
  changePassword,
};
