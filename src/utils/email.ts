import nodemailer from "nodemailer";
import { mailOptions, nodemailerMailOptions } from "../types/email";
import { userDocument } from "../types/documentTypes";
import { NextFunction } from "express";
import AppError from "./appError";
import { resettingUserCodeFields } from "./generatingCode";

export const sendMail = async (options: mailOptions) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const opt: nodemailerMailOptions = {
    from: `E-shop <${process.env.GMAIL_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  await transporter.sendMail(opt);
};

export const sendingCodeToEmail = async (
  user: userDocument,
  subject: string,
  message: string,
  next: NextFunction
) => {
  try {
    await sendMail({
      email: user.email,
      subject: subject,
      message: message,
    });
  } catch (err) {
    await resettingUserCodeFields(user);
    return next(new AppError((err as Error).message, 400));
  }
};
