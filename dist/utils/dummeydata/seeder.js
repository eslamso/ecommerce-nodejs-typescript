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
const fs_1 = __importDefault(require("fs"));
require("colors");
const product_model_1 = __importDefault(require("../../models/product.model"));
const dbConnection_1 = __importDefault(require("../../config/dbConnection"));
(0, dbConnection_1.default)("mongodb+srv://eslamTarek:33665599@cluster0.tgytazs.mongodb.net/express-ts-ecommerce?retryWrites=true&w=majority");
// Read data
const products = JSON.parse(fs_1.default.readFileSync("./products.json").toString());
// Insert data into DB
const insertData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield product_model_1.default.create(products);
        console.log("Data Inserted".green.inverse);
        process.exit();
    }
    catch (error) {
        console.log(error);
    }
});
// Delete data from DB
const destroyData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield product_model_1.default.deleteMany();
        console.log("Data Destroyed".red.inverse);
        process.exit();
    }
    catch (error) {
        console.log(error);
    }
});
// npx ts-node seeder.ts -d/-i
if (process.argv[2] === "-i") {
    insertData();
}
else if (process.argv[2] === "-d") {
    destroyData();
}
