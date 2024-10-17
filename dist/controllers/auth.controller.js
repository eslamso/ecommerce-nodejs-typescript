"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_services_1 = require("../services/auth.services");
const auth_validator_1 = require("../middlewares/validators/auth.validator");
const authRouter = express_1.default.Router();
authRouter.post("/signup", auth_validator_1.signUpValidator, auth_services_1.signUp);
authRouter.put("/activateEmail/:activationToken", auth_validator_1.activateEmailValidator, auth_services_1.activateEmail);
authRouter.put("/resendActivationCode/:activationToken", auth_validator_1.activateEmailValidator, auth_services_1.resendActivationCode);
authRouter.post("/login", auth_services_1.logIn);
authRouter.post("/forgetPassword", auth_validator_1.forgetPasswordValidator, auth_services_1.forgetPassword);
authRouter.post("/resendResetCode/:resetActivationToken", auth_services_1.resendResetCode);
authRouter.put("/verifyResetCode/:resetActivationToken", auth_validator_1.verifyPasswordResetCodeValidator, auth_services_1.verifyPasswordResetCode);
authRouter.put("/resetPassword/:passwordResetToken", auth_validator_1.resetPasswordValidator, auth_services_1.resetPassword);
authRouter.post("/logout", auth_services_1.protect, auth_services_1.logOut);
exports.default = authRouter;
