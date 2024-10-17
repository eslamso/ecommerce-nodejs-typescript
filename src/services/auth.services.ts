import { Request, Response, NextFunction, response } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError";
import {
  activateEmailBody,
  activateEmailParams,
  forgetPasswordBody,
  logInBody,
  resetPasswordBody,
  resetPasswordParams,
  signUpBody,
  verifyResetCodeBody,
  verifyResetCodeParams,
} from "../dtos/auth.dto";
import catchAsync from "express-async-handler";
import { sendingCodeToEmail } from "../utils/email";
import {
  resettingUserCodeFields,
  cryptoEncryption,
  generateAnotherActivationCode,
  generateAndEmailCodeWithSendResponse,
  generateAndEmailPassResetCode,
  generateAnotherPassResetCode,
  resetCodeVerified,
} from "../utils/generatingCode";
import { hashingPassword, isCorrectPassword } from "../utils/password";
import { createAccessToken, verifyToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";

export const signUp = catchAsync(
  async (
    req: Request<{}, {}, signUpBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password } = req.body;
    // hashing password before saving it in data base
    const hashedPassword = await hashingPassword(password);
    //1- create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(req.body);
    //2- create activation code and token and email and send response
    await generateAndEmailCodeWithSendResponse(newUser, res, next);
  }
);

export const activateEmail = catchAsync(
  async (
    req: Request<activateEmailParams, {}, activateEmailBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { activationToken } = req.params;
    const { code } = req.body;
    const hashActivationCode = cryptoEncryption(code);
    const user = await User.findOne({
      activationToken: activationToken,
    });
    if (!user) {
      return next(new AppError("user not found or token expired", 404));
    }

    if (
      user.activationCode != hashActivationCode ||
      user.activationCodeExpiresIn!.getTime() < Date.now()
    ) {
      return next(new AppError("code is incorrect or expired", 400));
    }
    user.isActivated = true;
    resettingUserCodeFields(user);
    res.status(200).json({
      success: true,
      message: "email has been activated successfully, please login",
    });
  }
);

export const resendActivationCode = catchAsync(
  async (
    req: Request<activateEmailParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { activationToken } = req.params;
    const user = await User.findOne({ activationToken: activationToken });
    if (!user) {
      return next(
        new AppError("user belong to that token does not exist", 400)
      );
    }
    const code = await generateAnotherActivationCode(user);
    const subject = "email activation";
    const message = `your activation code is ${code}`;
    await sendingCodeToEmail(user, subject, message, next);
    res.status(200).json({
      success: true,
      message: "code sent, please check your mail box",
    });
  }
);

export const logIn = catchAsync(
  async (
    req: Request<{}, {}, logInBody>,
    res: Response,
    next: NextFunction
  ) => {
    console.log(typeof req.query.limit, typeof req.query.page);
    const { email, password } = req.body;
    //1- find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("email or password is incorrect", 400));
    }
    //2- checking password correction
    const isPassCorrect = await isCorrectPassword(password, user.password);
    if (!isPassCorrect) {
      return next(new AppError("email or password is incorrect", 400));
    }
    // checking is email active
    if (!user.isActivated) {
      await generateAndEmailCodeWithSendResponse(user, res, next);
    } else {
      //3- create access token
      const accessToken = createAccessToken(user._id);
      //4-sending cookies and response
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000, //30 day
      });
      res.status(200).json({
        success: true,
        user,
        accessToken,
      });
    }
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[0];
    } else {
      token = req.cookies.accessToken;
    }
    if (!token) {
      return next(
        new AppError(
          "you are not logged in please login to access this route",
          401
        )
      );
    }
    let decoded: JwtPayload;
    decoded = verifyToken(token);
    const user = await User.findById(decoded!.userId);
    if (!user) {
      return next(
        new AppError("user belong to that token does not exist", 401)
      );
    }

    if (user.passwordChangedAt) {
      const passChangedAtTimeStamp = parseInt(
        `${user.passwordChangedAt.getTime() / 1000}`,
        10
      );

      if (passChangedAtTimeStamp > decoded!.iat!) {
        return next(
          new AppError("password is changed please login again", 401)
        );
      }
    }
    req.user = user; // for letting user to use protected routes
    next();
  }
);

export const restrictTo = (...roles: string[]) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user!.role!)) {
      return next(
        new AppError("you do not have right to access this route ", 403)
      );
    }
    next();
  });

export const forgetPassword = catchAsync(
  async (
    req: Request<{}, {}, forgetPasswordBody>,
    res: Response,
    next: NextFunction
  ) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("no user found with this email", 404));
    }
    const resetVerificationToken = await generateAndEmailPassResetCode(
      user,
      next
    );
    res.status(200).json({
      success: true,
      resetVerificationToken,
    });
  }
);

export const resendResetCode = catchAsync(
  async (
    req: Request<verifyResetCodeParams>,
    res: Response,
    next: NextFunction
  ) => {
    const { resetActivationToken } = req.params;
    const user = await User.findOne({
      passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
      return next(
        new AppError("user belong to that token does not exist", 400)
      );
    }
    const code = await generateAnotherPassResetCode(user);
    const subject = "password reset code";
    const message = `your password reset code is valid for (10 min) \n
    ${code}\n`;
    await sendingCodeToEmail(user, subject, message, next);
    res.status(200).json({
      success: true,
      message: "reset code sent, please check your mail box",
    });
  }
);

export const verifyPasswordResetCode = catchAsync(
  async (
    req: Request<verifyResetCodeParams, {}, verifyResetCodeBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { code } = req.body;
    const { resetActivationToken } = req.params;
    const user = await User.findOne({
      passwordResetVerificationToken: resetActivationToken,
    });
    if (!user) {
      return next(new AppError("no user founded with reset token", 404));
    }
    const hashedCode = cryptoEncryption(code);
    if (
      user.passwordResetCode != hashedCode ||
      user.passwordResetCodeExpires!.getTime() < Date.now()
    ) {
      return next(new AppError("invalid or expired code", 400));
    }
    const passwordResetToken = await resetCodeVerified(user);
    res.status(200).json({
      success: true,
      message: "code verified",
      passwordResetToken: passwordResetToken,
    });
  }
);

export const resetPassword = catchAsync(
  async (
    req: Request<resetPasswordParams, {}, resetPasswordBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { passwordResetToken } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      passwordResetToken,
    });
    if (!user) {
      return next(new AppError("now user founded with that token", 404));
    }
    const hashedPassword = await hashingPassword(newPassword);
    user.password = hashedPassword;
    user.passwordChangedAt = new Date(Date.now());
    resettingUserCodeFields(user);
    res.status(200).json({
      success: true,
      message: "password reset successfully,please login",
    });
  }
);

export const logOut = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken");
    res.status(200).json({
      success: true,
      message: "logged out successfully",
    });
  }
);
