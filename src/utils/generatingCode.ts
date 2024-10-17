import crypto from "crypto";
import { userDocument } from "../types/documentTypes";
import { NextFunction, Response } from "express";
import { sendingCodeToEmail } from "./email";
import AppError from "./appError";
// create general code for activation or resetting password
const createCode = (): string => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
};
// use crypto lib to encrypt password token any thing else
export const cryptoEncryption = (objective: string) => {
  return crypto.createHash("sha256").update(objective).digest("hex");
};

//used for generating activation code and adn activationToken
const generateActivationTokenAndCode = async (user: userDocument) => {
  //1- generate code
  const code = createCode();
  const hashedCode = cryptoEncryption(code);
  //3- generate activation Token
  const activationToken = `${user.email + code}`;
  const hashedActivationToken = cryptoEncryption(activationToken);
  //5 save token and code to user
  user.activationCode = hashedCode;
  user.activationCodeExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.activationToken = hashedActivationToken;
  await user.save();
  return [hashedActivationToken, code];
};

export const resettingUserCodeFields = async (user: userDocument) => {
  user.activationCode = undefined;
  user.activationCodeExpiresIn = undefined;
  user.activationToken = undefined;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetVerificationToken = undefined;
  user.passwordResetToken = undefined;
  user.activationCode = undefined;
  await user.save();
};

export const generateAnotherActivationCode = async (user: userDocument) => {
  const code = createCode();
  const hashedCode = cryptoEncryption(code);

  user.activationCode = hashedCode;
  user.activationCodeExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();
  return code;
};

export const generateAndEmailCodeWithSendResponse = async (
  user: userDocument,
  res: Response,
  next: NextFunction
) => {
  const [activationToken, code]: string[] =
    await generateActivationTokenAndCode(user);
  //3- send email to user
  const subject = "email activation";
  const message = `your activation code is ${code}`;
  await sendingCodeToEmail(user, subject, message, next);
  // 4- send response
  res.status(201).json({
    success: true,
    activationToken,
  });
};

//used for generating activation code and adn activationToken
const generatePassResetTokenAndCode = async (user: userDocument) => {
  //1- generate code
  const code = createCode();
  const hashedCode = cryptoEncryption(code);
  //3- generate activation Token
  const activationToken = `${user.email + code}`;
  const hashedActivationToken = cryptoEncryption(activationToken);
  //5 save token and code to user
  user.passwordResetCode = hashedCode;
  user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.passwordResetVerificationToken = hashedActivationToken;
  await user.save();
  return [hashedActivationToken, code];
};

export const generateAndEmailPassResetCode = async (
  user: userDocument,
  next: NextFunction
) => {
  const [hashedActivationToken, code]: string[] =
    await generatePassResetTokenAndCode(user);
  //3- send email to user
  const subject = "password reset code";
  const message = `your password reset code is valid for (10 min) \n
  ${code}\n`;
  await sendingCodeToEmail(user, subject, message, next);
  return hashedActivationToken;
};

export const generateAnotherPassResetCode = async (user: userDocument) => {
  const code = createCode();
  const hashedCode = cryptoEncryption(code);

  user.passwordResetCode = hashedCode;
  user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  await user.save();
  return code;
};

export const resetCodeVerified = async (user: userDocument) => {
  if (!user.isActivated) {
    user.isActivated = true;
    user.activationCode = undefined;
    user.activationCodeExpiresIn = undefined;
    user.activationToken = undefined;
  }
  const resetToken = `${user.email}+${user.passwordResetVerificationToken}`;
  const passwordResetToken = cryptoEncryption(resetToken);
  user.passwordResetToken = passwordResetToken;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetVerificationToken = undefined;
  await user.save();
  return passwordResetToken;
};
