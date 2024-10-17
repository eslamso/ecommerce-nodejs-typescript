"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetCodeVerified = exports.generateAnotherPassResetCode = exports.generateAndEmailPassResetCode = exports.generateAndEmailCodeWithSendResponse = exports.generateAnotherActivationCode = exports.resettingUserCodeFields = exports.cryptoEncryption = void 0;
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("./email");
// create general code for activation or resetting password
const createCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
};
// use crypto lib to encrypt password token any thing else
const cryptoEncryption = (objective) => {
    return crypto_1.default.createHash("sha256").update(objective).digest("hex");
};
exports.cryptoEncryption = cryptoEncryption;
//used for generating activation code and adn activationToken
const generateActivationTokenAndCode = (user) => __awaiter(void 0, void 0, void 0, function* () {
    //1- generate code
    const code = createCode();
    const hashedCode = (0, exports.cryptoEncryption)(code);
    //3- generate activation Token
    const activationToken = `${user.email + code}`;
    const hashedActivationToken = (0, exports.cryptoEncryption)(activationToken);
    //5 save token and code to user
    user.activationCode = hashedCode;
    user.activationCodeExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.activationToken = hashedActivationToken;
    yield user.save();
    return [hashedActivationToken, code];
});
const resettingUserCodeFields = (user) => __awaiter(void 0, void 0, void 0, function* () {
    user.activationCode = undefined;
    user.activationCodeExpiresIn = undefined;
    user.activationToken = undefined;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerificationToken = undefined;
    user.passwordResetToken = undefined;
    user.activationCode = undefined;
    yield user.save();
});
exports.resettingUserCodeFields = resettingUserCodeFields;
const generateAnotherActivationCode = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const code = createCode();
    const hashedCode = (0, exports.cryptoEncryption)(code);
    user.activationCode = hashedCode;
    user.activationCodeExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    yield user.save();
    return code;
});
exports.generateAnotherActivationCode = generateAnotherActivationCode;
const generateAndEmailCodeWithSendResponse = (user, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [activationToken, code] = yield generateActivationTokenAndCode(user);
    //3- send email to user
    const subject = "email activation";
    const message = `your activation code is ${code}`;
    yield (0, email_1.sendingCodeToEmail)(user, subject, message, next);
    // 4- send response
    res.status(201).json({
        success: true,
        activationToken,
    });
});
exports.generateAndEmailCodeWithSendResponse = generateAndEmailCodeWithSendResponse;
//used for generating activation code and adn activationToken
const generatePassResetTokenAndCode = (user) => __awaiter(void 0, void 0, void 0, function* () {
    //1- generate code
    const code = createCode();
    const hashedCode = (0, exports.cryptoEncryption)(code);
    //3- generate activation Token
    const activationToken = `${user.email + code}`;
    const hashedActivationToken = (0, exports.cryptoEncryption)(activationToken);
    //5 save token and code to user
    user.passwordResetCode = hashedCode;
    user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.passwordResetVerificationToken = hashedActivationToken;
    yield user.save();
    return [hashedActivationToken, code];
});
const generateAndEmailPassResetCode = (user, next) => __awaiter(void 0, void 0, void 0, function* () {
    const [hashedActivationToken, code] = yield generatePassResetTokenAndCode(user);
    //3- send email to user
    const subject = "password reset code";
    const message = `your password reset code is valid for (10 min) \n
  ${code}\n`;
    yield (0, email_1.sendingCodeToEmail)(user, subject, message, next);
    return hashedActivationToken;
});
exports.generateAndEmailPassResetCode = generateAndEmailPassResetCode;
const generateAnotherPassResetCode = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const code = createCode();
    const hashedCode = (0, exports.cryptoEncryption)(code);
    user.passwordResetCode = hashedCode;
    user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    yield user.save();
    return code;
});
exports.generateAnotherPassResetCode = generateAnotherPassResetCode;
const resetCodeVerified = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user.isActivated) {
        user.isActivated = true;
        user.activationCode = undefined;
        user.activationCodeExpiresIn = undefined;
        user.activationToken = undefined;
    }
    const resetToken = `${user.email}+${user.passwordResetVerificationToken}`;
    const passwordResetToken = (0, exports.cryptoEncryption)(resetToken);
    user.passwordResetToken = passwordResetToken;
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerificationToken = undefined;
    yield user.save();
    return passwordResetToken;
});
exports.resetCodeVerified = resetCodeVerified;
