import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import { UserControllers } from "./user.controller";
import parseBodyData from "../../../helpars/parseBodyData";
import { fileUploader } from "../../../helpars/fileUploader";
const router = express.Router();

router.post("/register", UserControllers.registerUser);

router.get("/", UserControllers.getAllUsers);

router.get("/me", auth("USER", "ADMIN"), UserControllers.getMyProfile);

router.get("/:id", auth(), UserControllers.getUserDetails);
router.put(
  "/update-profile",
  auth("USER", "ADMIN"),
  fileUploader.uploadprofileImage,
  parseBodyData,
  UserControllers.updateMyProfile
);

router.put(
  "/update-user/:id",
  auth("ADMIN"),
  UserControllers.updateUserRoleStatus
);

router.delete("/:id", auth("ADMIN"), UserControllers.deleteUser);

router.post(
  "/forgot-password",
  validateRequest(UserValidations.forgotPassword),
  UserControllers.forgotPassword
);

router.post(
  "/verify-otp",
  validateRequest(UserValidations.verifyOtp),
  UserControllers.verifyOtp
);

router.post(
  "/change-password",
  validateRequest(UserValidations.changePassword),
  UserControllers.changePassword
);

export const UserRouters = router;
