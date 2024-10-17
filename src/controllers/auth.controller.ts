import express from "express";
import {
  activateEmail,
  forgetPassword,
  logIn,
  logOut,
  protect,
  resendActivationCode,
  resendResetCode,
  resetPassword,
  signUp,
  verifyPasswordResetCode,
} from "../services/auth.services";
import {
  activateEmailValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
  signUpValidator,
  verifyPasswordResetCodeValidator,
} from "../middlewares/validators/auth.validator";

const authRouter = express.Router();

authRouter.post("/signup", signUpValidator, signUp);
authRouter.put(
  "/activateEmail/:activationToken",
  activateEmailValidator,
  activateEmail
);
authRouter.put(
  "/resendActivationCode/:activationToken",
  activateEmailValidator,
  resendActivationCode
);
authRouter.post("/login", logIn);
authRouter.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
authRouter.post("/resendResetCode/:resetActivationToken", resendResetCode);
authRouter.put(
  "/verifyResetCode/:resetActivationToken",
  verifyPasswordResetCodeValidator,
  verifyPasswordResetCode
);
authRouter.put(
  "/resetPassword/:passwordResetToken",
  resetPasswordValidator,
  resetPassword
);
authRouter.post("/logout", protect, logOut);

export default authRouter;
