import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserFromDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "For proceed further, please check your email for OTP",
    data: result,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  const id = req.user.id;
  await AuthServices.logoutUser(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Successfully logged out",
    data: null,
  });
});

export const AuthControllers = { loginUser, logoutUser };
