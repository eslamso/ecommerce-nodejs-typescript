"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode, validatorErrors) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.validatorErrors = validatorErrors;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    }
}
exports.default = AppError;
