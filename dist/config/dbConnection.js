"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = (url) => {
    mongoose_1.default
        .connect(url)
        .then((c) => {
        console.log(`data base connect does Successfully:${c.connection.host}`.bgGreen);
    })
        .catch((e) => {
        console.error(`failed to connect to data base: ${e}`.bgRed);
        process.exit(1);
    });
};
