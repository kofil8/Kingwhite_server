import httpStatus from "http-status";
import { AuthServices } from "./auth.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserFromDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: "User logged in successfully",
    data: result,
  });
});

export const AuthControllers = { loginUser };
