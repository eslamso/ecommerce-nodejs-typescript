"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const devError = (err, res) => {
    res.status(err.statusCode).json({
        success: err.status,
        message: err.message,
        stack: err.stack,
    });
};
const sendValidationError = (err, res) => {
    res.status(err.statusCode).json({
        message: err.message,
        errors: err.validatorErrors,
    });
};
const sendErrorProduction = (err, res) => {
    res.status(err.statusCode).json({
        success: err.status,
        message: err.message,
    });
};
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    if (err.message === "validationErrors") {
        sendValidationError(err, res);
    }
    else if (process.env.NODE_ENV === "development") {
        devError(err, res);
    }
    else {
        sendErrorProduction(err, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
