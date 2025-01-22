import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidation.loginUser),
  AuthControllers.loginUser
);

router.post(
  "/verify-otp",
  validateRequest(authValidation.verifyOtpLogin),
  AuthControllers.verifyOtp
);

// user logout route
router.post("/logout", auth(), AuthControllers.logoutUser);

export const AuthRouters = router;
