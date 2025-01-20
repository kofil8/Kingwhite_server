import httpStatus from "http-status";
import { UserServices } from "./user.service";
import { Request, Response } from "express";
import sendResponse from "../../../utils/sendResponse";
import catchAsync from "../../../utils/catchAsync";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.registerUserIntoDB(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Users Retrieve successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const result = await UserServices.getMyProfileFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const getUserDetails = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.getUserDetailsFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User details retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const payload = req.body.bodyData;
  const file = req.file as any;
  const result = await UserServices.updateMyProfileIntoDB(id, payload, file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});

const updateUserRoleStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await UserServices.updateUserRoleStatusIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.user.id;
  const result = await UserServices.deleteUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: result,
  });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "OTP sent successfully",
    data: result,
  });
});

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await UserServices.verifyOtp({ email, otp });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "OTP verified successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await UserServices.changePassword(payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "Password changed successfully",
    data: result,
  });
});

export const UserControllers = {
  registerUser,
  getAllUsers,
  getMyProfile,
  getUserDetails,
  updateMyProfile,
  updateUserRoleStatus,
  deleteUser,
  forgotPassword,
  verifyOtp,
  changePassword,
};
