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
exports.findAllFilterObj = exports.deleteOne = exports.updateOne = exports.getOne = exports.getAll = exports.createOne = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const apiFeatures_1 = require("./apiFeatures");
const appError_1 = __importDefault(require("./appError"));
const createOne = (Model, modelName) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = yield Model.create(req.body);
    res.status(201).json({
        success: true,
        doc,
    });
}));
exports.createOne = createOne;
const getAll = (Model, modelName) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //console.log(process.env.NODE_ENV);
    let filter = {};
    if (req.filterObj)
        filter = req.filterObj;
    const docsCount = yield Model.countDocuments();
    const query = new apiFeatures_1.ApiFeatures(Model.find(filter), req.query)
        .filter()
        .paginate(docsCount)
        .sorting()
        .limitFields()
        .searching(modelName);
    //2) consume query
    const { mongoQuery, pagination } = query;
    const docs = yield mongoQuery;
    res.status(200).json({
        success: true,
        results: docs.length,
        docs,
        pagination,
    });
}));
exports.getAll = getAll;
const getOne = (Model, modelName, populateOpt) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let query = Model.findById(id);
    let doc = yield query;
    if (!doc) {
        return next(new appError_1.default(`no ${modelName.toLocaleLowerCase()} found with that id`, 404));
    }
    if (populateOpt) {
        doc = yield doc.populate(populateOpt);
    }
    res.status(200).json({
        success: true,
        doc,
    });
}));
exports.getOne = getOne;
const updateOne = (Model, modelName) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doc = yield Model.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
    });
    if (!doc) {
        return next(new appError_1.default(`No ${modelName.toLocaleLowerCase()} found with that ID`, 404));
    }
    res.status(200).json({
        success: true,
        doc,
    });
}));
exports.updateOne = updateOne;
const deleteOne = (Model, modelName) => (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const doc = yield Model.findByIdAndDelete(id);
    if (!doc) {
        return next(new appError_1.default(`No ${modelName.toLocaleLowerCase()} found with that ID`, 404));
    }
    res.status(204).json({
        success: true,
    });
}));
exports.deleteOne = deleteOne;
exports.findAllFilterObj = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "user")
        req.filterObj = { user: req.user.id };
    next();
}));
