import { IUser } from "../models/user.model";
import { userDocument } from "../types/documentTypes";
declare global {
  namespace Express {
    interface Request {
      user?: userDocument;
    }
  }
}

export interface signUpBody extends Pick<IUser, "name" | "email" | "password"> {
  passwordConfirm: string;
}
export interface activateEmailBody {
  code: string;
}
export type activateEmailParams = {
  activationToken: string;
};
export type verifyResetCodeParams = {
  resetActivationToken: string;
};
export interface verifyResetCodeBody extends activateEmailBody {}
export type resetPasswordParams = {
  passwordResetToken: string;
};
export interface resetPasswordBody {
  newPassword: string;
  newPasswordConfirm: string;
}

export interface logInBody extends Pick<IUser, "email" | "password"> {}
export interface forgetPasswordBody extends Pick<IUser, "email"> {}
