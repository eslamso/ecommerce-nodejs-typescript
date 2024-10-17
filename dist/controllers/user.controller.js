"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_services_1 = require("../services/user.services");
const auth_services_1 = require("../services/auth.services");
const user_validator_1 = require("../middlewares/validators/user.validator");
const userRouter = express_1.default.Router();
userRouter.get("/myAddresses", auth_services_1.protect, user_services_1.getMyAddresses);
userRouter.post("/addMyAddress", auth_services_1.protect, user_validator_1.addMyAddressValidator, user_services_1.addMyAddress);
userRouter.put("/updateMyAddress/:id", auth_services_1.protect, user_validator_1.myAddressValidator, user_services_1.updateMyAddress);
userRouter.delete("/deleteMyAddress/:id", auth_services_1.protect, user_validator_1.myAddressValidator, user_services_1.removeMyAddress);
userRouter
    .route("/")
    .post(auth_services_1.protect, (0, auth_services_1.restrictTo)("admin"), user_services_1.uploadUserImage, user_validator_1.createUserValidator, user_services_1.resizeUserImage, user_services_1.createUser)
    .get(auth_services_1.protect, user_services_1.getAllUsers);
userRouter.put("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("admin"), user_services_1.uploadUserImage, user_validator_1.updateUserValidator, user_services_1.resizeUserImage, user_services_1.updateUser);
userRouter.delete("/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("admin"), user_validator_1.deleteUserValidator, user_services_1.deleteUser);
userRouter.get("/me", auth_services_1.protect, user_services_1.getMe);
userRouter.get("/:id", auth_services_1.protect, user_services_1.getUser);
userRouter.put("/changePassword/:id", auth_services_1.protect, (0, auth_services_1.restrictTo)("admin"), user_validator_1.changeUserPasswordValidator, user_services_1.changeUserPassword);
userRouter.patch("/changeMyPassword", auth_services_1.protect, user_validator_1.changeMyPasswordValidator, user_services_1.changeMyPassword);
userRouter.patch("/updateMe", auth_services_1.protect, user_services_1.uploadUserImage, user_validator_1.updateMeValidator, user_services_1.resizeUserImage, user_services_1.updateMe);
userRouter.post("/addProductToMyFav/:productId", auth_services_1.protect, user_validator_1.addProductToMyFavoritesValidator, user_services_1.addProductToMyFavorites);
userRouter.post("/removeProductToMyFav/:productId", auth_services_1.protect, user_validator_1.addProductToMyFavoritesValidator, user_services_1.removeProductToMyFavorites);
exports.default = userRouter;
