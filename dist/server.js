"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConnection_1 = __importDefault(require("./config/dbConnection"));
const app_1 = __importDefault(require("./app"));
const dbUrl = process.env.DATA_BASE;
(0, dbConnection_1.default)(dbUrl);
const port = 5000;
app_1.default.listen(port, () => {
    console.log(`the server is running on port ${port}`);
});
